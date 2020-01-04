/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import {ListItem} from 'react-native-elements';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import TouchableScale from 'react-native-touchable-scale';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class InviteMemberView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      newMemberEmail: '',
      newMember: null,
    };
  }

  async clickInviteMember() {
    this.loadingInviteMember.showLoading(true);
    let user = await GFunction.user();
    let response = await Api.searchGroup(
      user.authentication_jwt,
      this.state.newMemberEmail,
    );

    if (response.success) {
      this.loadingInviteMember.showLoading(false);
      if (response.user != null) {
        await this.setState({newMember: response.user});
      } else {
        GFunction.infoMessage(
          I18n.t('message.notFound'),
          I18n.t('message.notFoundUser'),
        );
      }
    } else {
      this.loadingInviteMember.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFunction.camelize(error)}`));
      });
      GFunction.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  async addToGroup(id) {
    let user = await GFunction.user();

    let response = await Api.joinGroup(
      user.authentication_jwt,
      this.props.group.id,
      id,
    );

    if (response.success) {
      this.props.onSetNewData(response.group);
      GFunction.successMessage(
        I18n.t('message.success'),
        I18n.t('message.inviteMemberSuccessful'),
      );
      this.props.modal.current.close();
    } else {
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFunction.camelize(error)}`));
      });
      GFunction.errorMessage(I18n.t('message.error'), errors.join('\n'));
    }
  }

  render() {
    return (
      <View style={{flex: 1, padding: 30}}>
        <Text style={{fontSize: 30, fontFamily: 'Kanit-Light'}}>
          {I18n.t('placeholder.inviteMember')}
        </Text>
        <View style={{paddingTop: 15}}>
          <TextInput
            style={{backgroundColor: '#FFF', fontFamily: 'Kanit-Light'}}
            label={I18n.t('placeholder.email')}
            value={this.state.newMemberEmail}
            onChangeText={newMemberEmail =>
              this.setState({newMemberEmail: newMemberEmail})
            }
          />
          <HelperText
            style={{fontFamily: 'Kanit-Light'}}
            type="error"
            visible={GFunction.validateEmail(this.state.newMemberEmail)}>
            {I18n.t('message.emailIsInvalid')}
          </HelperText>
        </View>
        <View style={{paddingTop: 15}}>
          {this.state.newMember != null ? (
            <ListItem
              onPress={() => this.addToGroup(this.state.newMember.id)}
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.85}
              leftAvatar={{source: {uri: this.state.newMember.photo}}}
              title={this.state.newMember.full_name}
              subtitle={this.state.newMember.email}
              containerStyle={{
                backgroundColor: '#F5F5F5',
                borderRadius: 20,
                fontFamily: 'Kanit-Light',
              }}
              chevron={
                <MatIcon
                  name="add"
                  size={35}
                  style={{
                    color: '#00D657',
                  }}
                />
              }
            />
          ) : null}
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingInviteMember = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.search')}
            titleFontFamily={'Kanit-Light'}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#03C8A1"
            borderRadius={25}
            onPress={this.clickInviteMember.bind(this)}
          />
        </View>
      </View>
    );
  }
}
