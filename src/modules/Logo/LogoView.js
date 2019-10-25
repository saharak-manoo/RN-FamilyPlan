import React, { Component } from 'react';
import {
  AsyncStorage,
  Alert,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class LogoView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: false,
    };
  }

  async componentWillMount() {
    let isSignIn = await AsyncStorage.getItem('isSignIn')
    await this.setState({ isSignIn: isSignIn != null })
    if (this.state.isSignIn) {
      this.props.navigation.navigate('Home')
    } else {
      this.props.navigation.navigate('Login')
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#1C83F7' }}>
        <StatusBar backgroundColor='#1C83F7' barStyle='light-content' />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch', alignSelf: 'center' }}>
          <Icon size={150} name='face' color='#FFF' />
        </View>
      </View>
    )
  }
}