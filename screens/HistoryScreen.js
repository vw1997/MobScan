import * as React from 'react';
import * as SQLite from 'expo-sqlite';
import { TouchableHighlight, Modal, FlatList, StyleSheet, Text, View } from 'react-native';
import { Container, Header, Content, Button, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { BrandonText } from '../components/BrandonTextRegular';
import { BrandonTextBold } from '../components/BrandonTextBold';

const db = SQLite.openDatabase("links.db");

function trunc(name) {
  if (name === undefined || name === null) {
    return "";
  }
  if (name.length > 30) {
    return name.substring(0, 29) + "...";
  } else {
    return name;
  }
}

export default function HistoryScreen() {
  const [links, setLinks] = React.useState(null);
  const [link, setLink] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(`select * from links;`, [], (_, { rows: { _array } }) => {
        setLinks(_array)
      });
    })
  })

  return (
    <View style={styles.container} contentContainerStyle={styles.contentContainer} >
      <FlatList style={{ marginRight: 10, marginLeft: 10 }} data={links} keyExtract={item => item["title"]} renderItem={({ item }) =>
        <View style={{ marginTop: 15, flexDirection: 'row', width: "100%" }}>
          <OptionButton
            label={trunc(item["title"])}
            onPress={() => {
              setLink(item["link"]);
              setModalVisible(true);
            }}
          />
          <OptionButton
            icon="md-trash"
            label={""}
            onPress={() => {
              db.transaction(tx => {
                tx.executeSql(`delete from links where link = ?`, [item["link"]]);
              })
            }}
            trash={true}
          />
        </View>
      }>
      </FlatList>

      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={{ flex: 1, marginTop: 22 }}>

          <WebView
            style={styles.WebViewStyle}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            source={{ uri: `https://www.youtube.com/embed/${link}` }}
          />

          <Button block onPress={() => {
            setModalVisible(!modalVisible);
          }} style={styles.mb15}>
            <BrandonText style={styles.buttonText}>Close</BrandonText>
          </Button>
        </View>
      </Modal>
    </View>

  );
}

function OptionButton({ icon, label, onPress, isLastOption, trash }) {
  if (trash) {
    return (
      <RectButton style={[styles.option, isLastOption && styles.lastOption, styles.trash]} onPress={onPress}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.optionIconContainer}>
            <Ionicons name={icon} size={22} color="#ffffff" />
          </View>
        </View>
      </RectButton>
    );
  } else {
    return (
      <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.optionTextContainer}>
            <BrandonText style={styles.optionText}>{label}</BrandonText>
          </View>
        </View>
      </RectButton>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ba0000',
  },
  optionTextContainer: {
    width: '85%',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    paddingVertical: 20,
    borderWidth: 9,
    borderColor: '#ba0000',
  },
  trash: {
    backgroundColor: '#ba0000',
  },
  lastOption: {
    borderBottomWidth: 10,
  },
  optionText: {
    fontSize: 16,
    alignSelf: 'flex-start',
    marginTop: 0,
  },
  WebViewStyle: {
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30
  },
  mb15: {
    height: 50,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    backgroundColor: '#ba0000'
  },
  list: {
    color: '#ba0000'
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff'
  }
});
