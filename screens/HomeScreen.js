import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Container, Header, Content, Button, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { ScrollView } from 'react-native-gesture-handler';
import { BrandonText } from '../components/BrandonTextRegular';
import { BrandonTextBold } from '../components/BrandonTextBold';

const HomeScreen = ({ navigation }) => {

  return (

    <StyleProvider style={getTheme(material)}>
      <Container>
        <Content padder style={{ backgroundColor: "#ba0000", padding: 20 }}>
          <Image style={{ width: 350, height: 350 }}
            source={require('../assets/images/logo.png')} />

          <Button block onPress={() => navigation.navigate('Scan')} style={styles.mb15}>
            <BrandonTextBold style={styles.buttonText}> Scan YouTube QR Code </BrandonTextBold>
          </Button>

          <Button block onPress={() => navigation.navigate('History')} style={styles.mb15}>
            <BrandonTextBold style={styles.buttonText}> View Past Scans </BrandonTextBold>
          </Button>

        </Content>
      </Container>

    </StyleProvider>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 20,
    color: '#ba0000'
  },
  mb15: {

    marginBottom: 20,
    height: 100,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

export default HomeScreen
