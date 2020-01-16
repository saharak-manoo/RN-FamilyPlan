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

export default class LogoView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: false,
      isSignIn: false,
    };
  }

  async UNSAFE_componentWillMount() {
    let isDarkMode = await AsyncStorage.getItem('isDarkMode');
    isDarkMode = JSON.parse(isDarkMode);
    if (isDarkMode == null) {
      isDarkMode = false;
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(false));
    }
    this.setState({isDarkMode: isDarkMode});

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
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.isDarkMode ? '#000' : '#FFF',
        }}>
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
