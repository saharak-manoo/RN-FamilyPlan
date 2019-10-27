import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text
} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../components/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import * as Api from '../../util/Api'
import * as GFunction from '../../util/GlobalFunction'
import { styles } from '../../components/styles';
import Spinner from 'react-native-loading-spinner-overlay';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ProfileView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      user: null,
    };
    this.getProfile();
  }

  componentDidMount = async () => {
    this.setState({ spinner: true });
    this.setState({ user: await GFunction.user() })
  }

  getProfile = async () => {
    this.setState({ spinner: true });
    let user = await GFunction.user()
    let response = await Api.getProfile(user.authentication_token, user.id);
    if (response.success) {
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      this.setState({
        prefix: response.user.prefix,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        phoneNumber: response.user.phone_number,
        photo: response.user.photo,
        spinner: false
      });
    } else {
      this.loadingSignOut.showLoading(false);
      GFunction.errorMessage(I18n.t('message.error'), I18n.t('message.loadFail'))
    }
  };

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#6D06F9' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#6D06F9' }}>
          <Appbar.Content
            title={I18n.t('message.profile')}
          />
        </Appbar.Header>
      </View>
    )
  }

  clickSignOut() {
    this.loadingSignOut.showLoading(true)
    this.signOut()
  }

  // async confirmAction() {
  //   Alert.alert(
  //     I18n.t('message.areYouSure'),
  //     '',
  //     [
  //       {
  //         text: I18n.t('button.cancel'),
  //         onPress: () => this.loadingSignOut.showLoading(false),
  //         style: 'cancel',
  //       },
  //       {
  //         text: I18n.t('button.signOut'),
  //         onPress: this.signOut()
  //       },
  //     ],
  //     { cancelable: false },
  //   );
  // }

  async signOut() {
    let response = await Api.signOut(this.state.user.authentication_token);
    if (response.success) {
      this.loadingSignOut.showLoading(false);
      await AsyncStorage.removeItem('user');
      GFunction.successMessage(I18n.t('message.success'), I18n.t('message.signOutSuccessful'))
      this.props.navigation.navigate('Login')
    } else {
      this.loadingSignOut.showLoading(false);
      GFunction.errorMessage(I18n.t('message.error'), I18n.t('message.signOutFail'))
    }
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        {this.state.spinner ? (<Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />) : (<View style={{ flex: 1 }}>
          <View style={styles.cardProfile}>
            <View style={{ flex: 1, padding: 10, alignSelf: 'center' }}>
              <Image
                source={{ uri: this.state.photo }}
                style={styles.profilePhoto}
              />

              <Text style={{ fontSize: 40, alignSelf: 'center', padding: 15 }}>{this.state.firstName + ' ' + this.state.lastName}</Text>
            </View>
          </View>
          <View style={{ flex: 0.1, justifyContent: 'flex-end', paddingBottom: 10 }}>
            <AnimateLoadingButton
              ref={load => (this.loadingSignOut = load)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signOut')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#F71C58'
              borderRadius={25}
              onPress={this.clickSignOut.bind(this)}
            />
          </View>
        </View>)}
      </View>
    );
  }
};