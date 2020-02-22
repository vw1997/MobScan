
import * as React from 'react';
import * as SQLite from 'expo-sqlite';
import { TouchableHighlight, Modal, View, Text, StyleSheet, TouchableOpacity, Image, Animated} from 'react-native';
import { BarCodeScanner} from 'expo-barcode-scanner';
import { WebView} from 'react-native-webview';
import {Permissions} from 'react-native-unimodules';
import { BrandonText } from '../components/BrandonTextRegular';
import { BrandonTextBold } from '../components/BrandonTextBold';
import { Button, StyleProvider } from 'native-base';

const db = SQLite.openDatabase("links.db");

function getId(url) {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
    return match[2];
    } else {
    return null;
    }
}

export default function ScanScreen(props) {
    const [hasCameraPermission, setCameraPermission] = React.useState(null)
  const [link, setLink] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [animationLineHeight, setAnimationLineHeight] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [focusLineAnimation, setFocusLineAnimation] = React.useState(
    new Animated.Value(0),
  )

  React.useEffect(() => {
    getPermissionsAsync()
    animateLine()
  }, [])

  const animateLine = () => {
    Animated.sequence([
      Animated.timing(focusLineAnimation, {
        toValue: 1,
        duration: 1000,
      }),

      Animated.timing(focusLineAnimation, {
        toValue: 0,
        duration: 1000,
      }),
    ]).start(animateLine)
  }

  const getPermissionsAsync = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA)
    const isPermissionGranted = status === 'granted'
    console.log(isPermissionGranted)
    setCameraPermission(isPermissionGranted)
  }

  const handleBarCodeScanned = ({type, data}) => {
    setScanned(true)
    let trimmed = getId(data);
    if (trimmed == null) {
        alert("The QR you scanned is not a valid Youtube video!");
        return;
    }

    const request = async () => {
        const response = await fetch("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + trimmed + "&key=" + "AIzaSyAyXfYNqQ1esSfXuG3ZlJczvugqRBq4wEo");
        const json = await response.json();

        let title = json["items"][0]["snippet"]["title"];
        db.transaction(tx => {
            console.log("Starting link insert of " + data)
            tx.executeSql("insert into links (link, title) values(?, ?)", [trimmed, title], (_, a) => {console.log("Added link")}, (_, e)=>{console.log(e)})
        })
    }

    request();

    setLink(trimmed);
    setModalVisible(true);
  }

  if (hasCameraPermission === null) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Requesting for camera permission</Text>
      </View>
    )
  }
  if (hasCameraPermission === false) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>No access to camera</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer}></View>

        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer}></View>
          <View
            onLayout={e =>
              setAnimationLineHeight({
                x: e.nativeEvent.layout.x,
                y: e.nativeEvent.layout.y,
                height: e.nativeEvent.layout.height,
                width: e.nativeEvent.layout.width,
              })
            }
            style={styles.focusedContainer}>
            {!scanned && (
              <Animated.View
                style={[
                  styles.animationLineStyle,
                  {
                    transform: [
                      {
                        translateY: focusLineAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, animationLineHeight.height],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}

            {scanned && (
              <TouchableOpacity
                onPress={() => setScanned(false)}
                style={styles.rescanIconContainer}>
                <Image
                  source={require('../rescan.png')}
                  style={{width: 50, height: 50}}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={{flex:1, marginTop: 22}}>
        <WebView
                    style={ styles.WebViewStyle }
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{uri: `https://www.youtube.com/embed/${link}` }}
            />

            <Button block onPress={() => {
                setModalVisible(!modalVisible);
            }} style={styles.mb15}>
            <BrandonText style={styles.buttonText}>Close</BrandonText>
            </Button>
        </View>
      </Modal>
    </View>
  )
    }

    const styles = StyleSheet.create({
        WebViewStyle: {
            marginTop: 30, 
            marginLeft: 30,
            marginRight: 30
          }, 
        container: {
        flex: 1,
        position: 'relative',
        },
        overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        },
        unfocusedContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        },
        middleContainer: {
        flexDirection: 'row',
        flex: 1.5,
        },
        focusedContainer: {
        flex: 6,
        },
        animationLineStyle: {
        height: 2,
        width: '100%',
        backgroundColor: 'red',
        },
        rescanIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        },
        mb15: {
            height:50,    
            marginBottom: 20,
            marginLeft: 30,
            marginRight: 30, 
            marginTop: 20, 
            backgroundColor:'#ba0000'
          },
        buttonText: {
            fontSize: 20,
            color: '#ffffff'
          }
        })
