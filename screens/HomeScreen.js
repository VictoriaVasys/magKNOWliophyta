import React from 'react';
import { ActivityIndicator, Clipboard, Dimensions, FlatList, ImageBackground, ScrollView, Share, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Camera, Permissions, WebBrowser, ImagePicker } from 'expo';
import { Button, Icon, Text, Image } from 'react-native-elements'
import uuid from 'uuid';
import Environment from '../config/environment';
import firebase from '../config/firebase';

import { MonoText } from '../components/StyledText';
import Colors, {getButtonBackground} from '../constants/Colors';


const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backgroundImage: {
    height: fullHeight,
    width: fullWidth
  },
  button: {
    backgroundColor: getButtonBackground(0.7),
    borderRadius: 10
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: fullWidth * 0.85,
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    borderRadius: 10,
    flex: 1,
    overflow: 'hidden',
  },
  cameraAndButtonContainer: {
    marginTop: 100,
    height: 1 * fullWidth,
    width: 0.8 * fullWidth,
  },
  container: {
    alignItems: 'center',
    height: fullHeight,
    flex: 1,
    justifyContent: 'center',
    marginTop: -48,
    opacity: 1,
  },
  image: {
    height: 1 * fullWidth,
    width: 0.8 * fullWidth,
  }
})

export default class HomeScreen extends React.Component {

  state = {
    cameraOn: false,
    hasCameraPermission: null,
    image: null,
    uploading: false,
    googleResponse: null,
    showAnalyzeButton: true,
    showNewPhotoButtons: true,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/vintage-poppy-diagram.jpg')} PlaceholderContent={<ActivityIndicator />} style={styles.backgroundImage}>
        <ScrollView>
          <View style={styles.container}>
            {this.state.showNewPhotoButtons && this.renderNewPhotoButtons()}
            {this.renderPlantFamily()}
            {this._maybeRenderImage()}
            {this.renderOtherLabels()}
            {this._maybeRenderUploadingOverlay()}
          </View>
        </ScrollView>
      </ImageBackground>
    )
  }

  renderNewPhotoButtons = () => {
    const { cameraOn, hasCameraPermission, image } = this.state;

    if (hasCameraPermission === null) {
      return;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (!cameraOn) {
      return (
        <View style={styles.buttons}>
          <Button onPress={this._takePhoto} icon={<Icon name='camera-alt' type='material' size={fullWidth * 0.36} color={Colors.buttonDefault} />} buttonStyle={styles.button} />
          <Button onPress={this._pickImage} icon={<Icon name='arrow-downward' type='material' size={fullWidth * 0.36} color={Colors.buttonDefault} />} buttonStyle={styles.button} />
        </View>
      )
    }
    // } else if (image) {
    //   return <Image style={styles.image} source={image && {uri: image.uri}} PlaceholderContent={<ActivityIndicator />} />
    // } else {
    //   return (
    //     <View style={styles.cameraAndButtonContainer}>
    //       <View style={styles.cameraContainer}>
    //         <Camera ref={ref => { this.camera = ref }} style={styles.camera} type={Camera.Constants.Type.back} />
    //       </View>
    //       <Button onPress={this.snap} icon={<Icon name='radio-button-checked' size={100} type='material' color={Colors.buttonDefault} />} type="clear" />
    //       {/* <Image style={{ width: 100, height: 100 }} source={require('../assets/capture.png')}></Image> */}
    //     </View>
    //   );
    // }
  }

  // addImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     this.setState({ image: result.uri });
  //   }
  // }

  // snap = () => {
  //   if (this.camera) {
  //     try {
  //       let image = this.camera.takePictureAsync().then(image => {
  //         this.setState({ image, showNewPhotoButtons: false })
  //       })
  //     } catch (err) {
  //       alert(err); // TypeError: failed to fetch
  //     }
  //   }
  // }

  // toggleCamera = () => {
  //   this.setState({cameraOn: true})
  // };

  // organize = array => {
  //   return array.map(function (item, i) {
  //     return (
  //       <View key={i}>
  //         <Text>{item}</Text>
  //       </View>
  //     );
  //   });
  // };

  renderPlantFamily = () => {
    if (this.state.googleResponse) {
      const familyItem = this.state.googleResponse.responses[0].labelAnnotations.find((item) => item.description.includes('family'))
      const family = familyItem ? family.description : "No plant family found"
    }
  }

  renderOtherLabels = () => {
    if (this.state.googleResponse) {
      const labels = this.state.googleResponse.responses[0].labelAnnotations.filter((item) => !item.description.includes('family'))
      const formattedLabels = labels.map(label => label.description).join(', ')
      return (<Text h4 h4Style={{ color: Colors.brown, fontSize: 16, backgroundColor: getButtonBackground(0.8) }}>{`Other descriptions include: ${labels && formattedLabels}.`}</Text>)
    }
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image, googleResponse, showAnalyzeButton } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          margin: 24
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden'
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250, borderColor: Colors.white, borderWidth: 3, borderRadius: 5 }} />
        </View>

        {showAnalyzeButton && (<Button
          buttonStyle={{ backgroundColor: getButtonBackground(0.8), marginTop: 5 }}
          onPress={() => this.submitToGoogle()}
          title="look up your flower"
          titleStyle={{ color: Colors.coral, fontWeight: 'bold' }}
        />)}
        
        {/* <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        /> */}

        {/* {googleResponse && (
          <Text
            onPress={this._copyToClipboard}
            onLongPress={this._share}
            style={{ paddingVertical: 10, paddingHorizontal: 10 }}
          >
            JSON.stringify(googleResponse.responses)}
					</Text>
        )} */}
      </View>
    );
  };

  // _keyExtractor = (item, index) => item.id;

  // _renderItem = item => {
  //   <Text>response: {JSON.stringify(item)}</Text>;
  // };

  _share = () => {
    Share.share({
      message: JSON.stringify(this.state.googleResponse.responses),
      title: 'Check it out',
      url: this.state.image
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied to clipboard');
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl, showNewPhotoButtons: false });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };

  submitToGoogle = async () => {
    try {
      this.setState({ uploading: true });
      let { image } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
            ],
            image: {
              source: {
                imageUri: image
              }
            }
          }
        ]
      });
      let response = await fetch(
        'https://vision.googleapis.com/v1/images:annotate?key=' +
        Environment['GOOGLE_CLOUD_VISION_API_KEY'],
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: body
        }
      );
      let responseJson = await response.json();
      console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        showAnalyzeButton: false,
        uploading: false
      });
    } catch (error) {
      console.log(error);
    }
  };
}

async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
}

        // <View style={styles.container}>
      //   <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      //     <View style={styles.welcomeContainer}>
      //       <Image
      //         source={
      //           __DEV__
      //             ? require('../assets/images/robot-dev.png')
      //             : require('../assets/images/robot-prod.png')
      //         }
      //         style={styles.welcomeImage}
      //       />
      //     </View>

      //     <View style={styles.getStartedContainer}>
      //       {/* {this._maybeRenderDevelopmentModeWarning()} */}

      //       <Text style={styles.getStartedText}>Get started by opening</Text>

      //       <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
      //         <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
      //       </View>

      //       <Text style={styles.getStartedText}>
      //         Change this to automatically reload.
      //       </Text>
      //     </View>

      //     <View style={styles.helpContainer}>
      //       <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
      //         <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
      //       </TouchableOpacity>
      //     </View>
      //   </ScrollView>

      //   <View style={styles.tabBarInfoContainer}>
      //     <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

      //     <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
      //       <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
      //     </View>
      //   </View>
      // </View>

  // _maybeRenderDevelopmentModeWarning() {
  //   if (__DEV__) {
  //     const learnMoreButton = (
  //       <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
  //         Learn more
  //       </Text>
  //     );

  //     return (
  //       <Text style={styles.developmentModeText}>
  //         Development mode is enabled, your app will be slower but you can use useful development
  //         tools. {learnMoreButton}
  //       </Text>
  //     );
  //   } else {
  //     return (
  //       <Text style={styles.developmentModeText}>
  //         You are not in development mode, your app will run at full speed.
  //       </Text>
  //     );
  //   }
  // }

  // _handleLearnMorePress = () => {
  //   WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  // };

  // _handleHelpPress = () => {
  //   WebBrowser.openBrowserAsync(
  //     'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
  //   );
  // };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
