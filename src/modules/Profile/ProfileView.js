import React, {Component} from 'react';
import {Dimensions, Image, Platform, StatusBar, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Text, Switch} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../components/i18n';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import {styles} from '../../components/styles';
import Spinner from 'react-native-loading-spinner-overlay';
import {ListItem} from 'react-native-elements';
import RNRestart from 'react-native-restart';
import UserAvatar from 'react-native-user-avatar';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

export default class ProfileView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      user: null,
      isLanguageTH: false,
      isDarkMode: true,
    };
    this.getProfile();
  }

  componentDidMount = async () => {
    this.setState({spinner: true});
    let locale = await AsyncStorage.getItem('locale');
    let isDarkMode = await AsyncStorage.getItem('isDarkMode');

    this.setState({
      user: await GFunction.user(),
      isLanguageTH: locale === 'th',
      isDarkMode: JSON.parse(isDarkMode),
    });
  };

  onSelectedLanguageTh = async isLanguageTH => {
    let locale = isLanguageTH ? 'th' : 'en';
    I18n.locale = locale;
    await AsyncStorage.setItem('locale', locale);
    this.setState({isLanguageTH: isLanguageTH});
    RNRestart.Restart();
  };

  onSwitchDarkMode = async isDarkMode => {
    await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    this.setState({isDarkMode: isDarkMode});
    RNRestart.Restart();
  };

  getProfile = async () => {
    this.setState({spinner: true});
    let user = await GFunction.user();
    let response = await Api.getProfile(user.authentication_jwt, user.id);
    if (response.success) {
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      this.setState({
        prefix: response.user.prefix,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        phoneNumber: response.user.phone_number,
        photo: response.user.photo,
        spinner: false,
      });
    } else {
      this.loadingSignOut.showLoading(false);
      GFunction.errorMessage(
        I18n.t('message.error'),
        I18n.t('message.loadFail'),
      );
    }
  };

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#6D06F9'}}>
          <Appbar.Content
            title={I18n.t('placeholder.profile')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  clickEditProfile() {
    this.loadingEditProfile.showLoading(true);
  }

  clickSignOut() {
    this.loadingSignOut.showLoading(true);
    this.signOut();
  }

  async signOut() {
    let response = await Api.signOut(this.state.user.authentication_jwt);
    if (response.success) {
      this.loadingSignOut.showLoading(false);
      await AsyncStorage.removeItem('user');

      GFunction.successMessage(
        I18n.t('message.success'),
        I18n.t('message.signOutSuccessful'),
      );

      this.props.navigation.navigate('Login');
    } else {
      this.loadingSignOut.showLoading(false);
      GFunction.errorMessage(
        I18n.t('message.error'),
        I18n.t('message.signOutFail'),
      );
    }
  }

  render() {
    return (
      <View
        style={{
          fontFamily: 'Kanit-Light',
          flex: 1,
          backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
        }}>
        {this.AppHerder()}

        <View style={{flex: 1}}>
          <View
            style={{
              fontFamily: 'Kanit-Light',
              flex: 1.4,
              margin: 10,
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              borderRadius: 10,
            }}>
            {this.state.spinner ? (
              <ContentLoader
                height={height}
                width={width / 0.5}
                primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                secondaryColor={this.state.isDarkMode ? '#363636' : '#ecebeb'}>
                <Circle cx="200" cy="65" r="60" />
                <Rect x="10" y="180" width={width / 1.12} height="50" />
                <Rect x="75" y="250" width={width / 1.75} height="20" />
                <Rect x="90" y="290" width={width / 2} height="20" />
                <Rect
                  x="55"
                  y="360"
                  rx={20}
                  ry={20}
                  width={width / 1.5}
                  height="40"
                />
              </ContentLoader>
            ) : (
              <View style={styles.profile}>
                <View style={{alignSelf: 'center'}}>
                  <UserAvatar
                    size="120"
                    name={this.state.firstName + ' ' + this.state.lastName}
                  />
                </View>
                <Text style={styles.profileName}>
                  {this.state.firstName + ' ' + this.state.lastName}
                </Text>
                <Text style={styles.profileText}>{this.state.email}</Text>
                <Text style={styles.profileText}>{this.state.phoneNumber}</Text>
              </View>
            )}

            <View style={{paddingBottom: 15}}>
              <AnimateLoadingButton
                ref={load => (this.loadingEditProfile = load)}
                width={width - 125}
                height={40}
                title={I18n.t('button.editProfile')}
                titleFontSize={18}
                titleColor="#FFF"
                backgroundColor="#2AAEF9"
                titleFontFamily={'Kanit-Light'}
                borderRadius={25}
                onPress={this.clickEditProfile.bind(this)}
              />
            </View>
          </View>

          <View
            style={{
              fontFamily: 'Kanit-Light',
              flex: 0.5,
              margin: 10,
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              borderRadius: 10,
            }}>
            {this.state.spinner ? (
              <ContentLoader
                height={height}
                width={width / 0.5}
                primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                secondaryColor={this.state.isDarkMode ? '#363636' : '#ecebeb'}>
                <Rect x="10" y="20" width={width / 2} height="20" />
                <Rect x="340" y="20" width={width / 10} height="20" />
                <Rect x="10" y="70" width={width / 2} height="20" />
                <Rect x="340" y="70" width={width / 10} height="20" />
                <Rect x="10" y="120" width={width / 2} height="20" />
                <Rect x="340" y="120" width={width / 10} height="20" />
                <Rect
                  x="55"
                  y="360"
                  rx={20}
                  ry={20}
                  width={width / 1.5}
                  height="40"
                />
              </ContentLoader>
            ) : (
              <View>
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
                        this.onSelectedLanguageTh(isLanguageTH)
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
                        this.onSwitchDarkMode(isDarkMode)
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
              </View>
            )}
          </View>

          <View style={styles.buttonSignOut}>
            {this.state.spinner ? (
              <ContentLoader
                height={height}
                width={width / 0.9}
                primaryColor={this.state.isDarkMode ? '#333' : '#E7E7E7'}
                secondaryColor={this.state.isDarkMode ? '#363636' : '#ecebeb'}>
                <Rect
                  x={15}
                  y={840}
                  rx={25}
                  ry={25}
                  width={width / 1.07}
                  height="50"
                />
              </ContentLoader>
            ) : (
              <AnimateLoadingButton
                ref={load => (this.loadingSignOut = load)}
                width={width - 25}
                titleFontFamily={'Kanit-Light'}
                height={50}
                title={I18n.t('button.signOut')}
                titleFontSize={18}
                titleColor="#FFF"
                backgroundColor="#F71C58"
                borderRadius={25}
                onPress={this.clickSignOut.bind(this)}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}
