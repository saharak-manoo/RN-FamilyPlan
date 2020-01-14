import React, {Component} from 'react';
import {
  Alert,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  StatusBar,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import I18n from '../../components/i18n';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';
const BAR_COLOR = IS_IOS ? '#2370E6' : '#000';

export default class LogoView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: true,
      isSignIn: false,
    };
  }

  async UNSAFE_componentWillMount() {
    let isDarkMode = await AsyncStorage.getItem('isDarkMode');
    isDarkMode = JSON.parse(isDarkMode);
    if (isDarkMode == null) {
      isDarkMode = true;
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(true));
    }

    let isSignIn = await AsyncStorage.getItem('user');
    await this.setState({isSignIn: isSignIn != null});
    if (this.state.isSignIn) {
      this.props.navigation.navigate('Home', {
        isDarkMode: isDarkMode,
      });
    } else {
      this.props.navigation.navigate('Login', {
        isDarkMode: isDarkMode,
      });
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#202020'}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'stretch',
            alignSelf: 'center',
          }}>
          <Image
            style={{width: 145, height: 145}}
            source={require('../../img/app-logo.png')}
          />
        </View>
      </View>
    );
  }
}
