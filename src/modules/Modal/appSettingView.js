/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  View,
  Linking,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {setScreenBadgeNow, setDarkMode, setLanguage} from '../actions';
import {Appbar, Text, TextInput, HelperText, Switch} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import * as Api from '../actions/api';
import * as GFun from '../../helpers/globalFunction';
import {ListItem} from 'react-native-elements';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class AppSettingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLanguageTH: this.props.setting.locale === 'th',
      isDarkMode: this.props.setting.isDarkMode,
    };
  }

  componentDidMount = async () => {
    let locale = await AsyncStorage.getItem('locale');

    this.setState({
      isLanguageTH: locale === 'th',
    });
  };

  alertChangeLanguage(isLanguageTH) {
    Alert.alert(
      '',
      I18n.t('message.needToRestartTheApp'),
      [
        {
          text: I18n.t('button.cancel'),
          style: 'cancel',
          style: 'destructive',
        },
        {
          text: I18n.t('button.ok'),
          onPress: () => this.onSelectedLanguageTh(isLanguageTH),
        },
      ],
      {
        cancelable: false,
      },
    );
  }

  onSelectedLanguageTh = async isLanguageTH => {
    let locale = isLanguageTH ? 'th' : 'en';
    I18n.locale = locale;
    await AsyncStorage.setItem('locale', locale);
    this.setState({isLanguageTH: isLanguageTH});
    RNRestart.Restart();
  };

  alertChangeToDarkMode(isDarkMode) {
    Alert.alert(
      '',
      I18n.t('message.needToRestartTheApp'),
      [
        {
          text: I18n.t('button.cancel'),
          style: 'cancel',
          style: 'destructive',
        },
        {
          text: I18n.t('button.ok'),
          onPress: () => this.onSwitchDarkMode(isDarkMode),
        },
      ],
      {
        cancelable: false,
      },
    );
  }

  onSwitchDarkMode = async isDarkMode => {
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    this.setState({isDarkMode: isDarkMode});
    RNRestart.Restart();
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 30,
          backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <Text style={{fontSize: 30, fontFamily: 'Kanit-Light'}}>
          {I18n.t('placeholder.appSetting')}
        </Text>
        <View style={{paddingTop: GFun.hp(2)}}>
          <ScrollView style={{borderRadius: 10}}>
            <ListItem
              containerStyle={{
                borderRadius: 10,
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              }}
              title={I18n.t('placeholder.th')}
              titleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              chevron={
                <Switch
                  value={this.state.isLanguageTH}
                  onValueChange={isLanguageTH =>
                    this.alertChangeLanguage(isLanguageTH)
                  }
                />
              }
            />
            <ListItem
              containerStyle={{
                borderRadius: 10,
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              }}
              title={I18n.t('placeholder.darkMode')}
              titleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              chevron={
                <Switch
                  value={this.state.isDarkMode}
                  onValueChange={isDarkMode =>
                    this.alertChangeToDarkMode(isDarkMode)
                  }
                />
              }
            />
            <ListItem
              containerStyle={{
                borderRadius: 10,
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              }}
              title={I18n.t('placeholder.appVersion')}
              titleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              chevron={<Text>0.0.1</Text>}
            />
          </ScrollView>
          <View style={{paddingTop: 35}}></View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  screenBadge: state.screenBadge,
  setting: state.setting,
});

const mapDispatchToProps = {
  setScreenBadgeNow,
  setDarkMode,
  setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppSettingView);
