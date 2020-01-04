import React, {Component} from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import NavigatorView from './Navigator/NavigatorView';
import FlashMessage from 'react-native-flash-message';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import I18n from '../components/i18n';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    placeholder: '#6D6D6D',
    text: '#000',
    primary: '#000',
    underlineColor: '#6D6D6D',
  },
  fonts: {light: 'Kanit-Light'},
};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    await AsyncStorage.getItem('locale').then(language => {
      if (language == null) {
        language = 'en';
      }
      I18n.locale = language;
    });
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <NavigatorView />
        <FlashMessage
          position="top"
          textStyle={{fontFamily: 'Kanit-Light'}}
          titleStyle={{fontFamily: 'Kanit-Light', fontSize: 15}}
        />
      </PaperProvider>
    );
  }
}
