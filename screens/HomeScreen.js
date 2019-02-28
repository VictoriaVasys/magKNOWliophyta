import React from 'react';
// import {
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
import { ActivityIndicator, Dimensions, ImageBackground, StyleSheet, TouchableOpacity, View, } from 'react-native'
import { Camera, Permissions, WebBrowser } from 'expo';
import { Button, Icon, Text } from 'react-native-elements'

import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    cameraOn: false,
    hasCameraPermission: null,
  };
  camera = null;

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/vintage-poppy-diagram.jpg')} PlaceholderContent={<ActivityIndicator />} style={styles.backgroundImage}>
        <View style={styles.container}>
          {this.renderContent()}
        </View>
      </ImageBackground>
    )
  }

  renderContent = () => {
    const { cameraOn, hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (!cameraOn) {
      return <Button onPress={this.toggleCamera} icon={<Icon name='camera-alt' type='material' size={300} color={Colors.brown} />} type="clear" />
    } else if (photo) {
      return <Button onPress={this.toggleCamera} icon={<Icon name='camera-alt' type='material' size={300} color={Colors.brown} />} type="clear" />
    } else {
      return (
        <View style={styles.cameraAndButtonContainer}>
          <View style={styles.cameraContainer}>
            <Camera ref={ref => { this.camera = ref }} style={styles.camera} type={Camera.Constants.Type.back} />
          </View>
          <Button onPress={this.snap} icon={<Icon name='radio-button-checked' size={100} type='material' color={Colors.brown} />} type="clear" />
          {/* <Image style={{ width: 100, height: 100 }} source={require('../assets/capture.png')}></Image> */}
        </View>
      );
    }
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
    }
  }

  toggleCamera = () => {
    this.setState({cameraOn: true})
  };
}

const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: '100%'
  },
  camera: {
    // backgroundColor: Colors.brown,
    // borderRadius: 5,
    flex: 1,
  },
  cameraContainer: {
    // backgroundColor: Colors.brown,
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
    // backgroundColor: 'blue',
    flex: 1,
    justifyContent: 'center',
    opacity: 1,
  },
})

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
