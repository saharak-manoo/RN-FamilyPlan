import React, {Component} from 'react';
import {
	Alert,
	View,
	Platform,
	Dimensions,
	Modal,
	TouchableOpacity,
	StatusBar,
} from 'react-native';
import {Appbar, Text, HelperText, TextInput} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../../components/i18n';
import * as Api from '../../../util/Api';
import * as GFunction from '../../../util/GlobalFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';
const BAR_COLOR = IS_IOS ? '#0144A4' : '#000';

export default class ForgotPasswordView extends Component<Props> {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
		};
	}

	appHerder() {
		return (
			<View>
				<Appbar.Header style={{backgroundColor: '#0144A4'}}>
					<Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
					<Appbar.Content title={I18n.t('placeholder.appName')} />
				</Appbar.Header>
			</View>
		);
	}

	clickResetPassword() {
		this.loadingResetPassword.showLoading(true);
		this.forgotPassword();
	}

	async forgotPassword() {
		let params = {
			email: this.state.email,
		};

		let response = await Api.forgotPassword(params);
		if (response.success) {
			this.loadingResetPassword.showLoading(false);
			GFunction.successMessage(
				I18n.t('message.success'),
				I18n.t('message.resetPassword'),
			);
			this.props.navigation.navigate('Login');
		} else {
			this.loadingResetPassword.showLoading(false);
			GFunction.errorMessage(
				I18n.t('message.notValidate'),
				I18n.t('message.' + response.messages),
			);
		}
	}

	render() {
		return (
			<View style={{flex: 1}}>
				{this.appHerder()}
				<View style={{padding: 45, alignContent: 'center'}}>
					<Text style={{alignSelf: 'center', fontSize: 38}}>
						{I18n.t('message.forgotPassword')}
					</Text>
				</View>
				<View style={{padding: 15}}>
					<TextInput
						style={{paddingBottom: 7}}
						label={I18n.t('placeholder.email')}
						mode="outlined"
						value={this.state.email}
						onChangeText={email => this.setState({email: email})}
					/>
					<HelperText
						type="error"
						visible={GFunction.validateEmail(this.state.email)}>
						{I18n.t('message.emailIsInvalid')}
					</HelperText>

					<View style={{justifyContent: 'center', paddingTop: 10}}>
						<AnimateLoadingButton
							ref={load => (this.loadingResetPassword = load)}
							width={width - 25}
							height={50}
							title={I18n.t('button.resetPassword')}
							titleFontSize={18}
							titleColor="#FFF"
							backgroundColor="#1C83F7"
							borderRadius={25}
							onPress={this.clickResetPassword.bind(this)}
						/>
					</View>
				</View>
			</View>
		);
	}
}
