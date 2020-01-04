import {Dimensions, StyleSheet, Platform} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_ANDROID = Platform.OS === 'android';

export const styles = StyleSheet.create({
  defaultView: {
    fontFamily: 'Kanit-Light',
    flex: 1,
    backgroundColor: '#EEEEEE',
  },

  chatView: {
    fontFamily: 'Kanit-Light',
    flex: 1,
    backgroundColor: '#FFF',
  },

  cardProfile: {
    fontFamily: 'Kanit-Light',
    flex: 1,
    margin: 10,
    marginTop: 90,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },

  cardSetting: {
    fontFamily: 'Kanit-Light',
    flex: 0.3,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },

  profilePhoto: {
    fontFamily: 'Kanit-Light',
    alignSelf: 'center',
    marginTop: -85,
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },

  homeColor: {
    backgroundColor: '#2370E6',
  },

  chatColor: {
    backgroundColor: '#09A650',
  },

  notiColor: {
    backgroundColor: '#2370E6',
  },

  settingColor: {
    backgroundColor: '#2370E6',
  },

  popUpModal: {
    backgroundColor: '#FFF',
  },

  overlayModal: {
    backgroundColor: 'transparent',
  },

  handleModal: {
    backgroundColor: '#C5C5C5',
  },

  spinnerTextStyle: {
    fontFamily: 'Kanit-Light',
    color: '#FFF',
  },

  actionButtonIcon: {
    fontFamily: 'Kanit-Light',
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  buttonSignOut: {
    fontFamily: 'Kanit-Light',
    flex: 0.25,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },

  profile: {
    fontFamily: 'Kanit-Light',
    flex: 1,
    padding: 10,
    alignSelf: 'center',
  },

  profileName: {
    fontFamily: 'Kanit-Light',
    fontSize: 35,
    alignSelf: 'center',
    paddingTop: 22,
  },

  profileText: {
    fontFamily: 'Kanit-Light',
    fontSize: 20,
    alignSelf: 'center',
    paddingTop: 22,
  },

  listCard: {
    fontFamily: 'Kanit-Light',
    flex: 0.1,
    borderLeftColor: '#03C8A1',
    borderLeftWidth: 4,
  },

  listPublicCard: {
    fontFamily: 'Kanit-Light',
    flex: 0.1,
    borderLeftColor: '#FAA829',
    borderLeftWidth: 4,
  },

  textCardList: {
    fontFamily: 'Kanit-Light',
    paddingLeft: 15,
    fontSize: 21,
  },

  listCards: {
    fontFamily: 'Kanit-Light',
    flex: 0.4,
    flexDirection: 'row',
  },

  card: {
    fontFamily: 'Kanit-Light',
    flex: 0.7,
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 20,
    width: width / 3,
  },

  headerCard: {
    fontFamily: 'Kanit-Light',
    flex: 0.5,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
  },

  headerCardNewGroup: {
    fontFamily: 'Kanit-Light',
    flex: 0.5,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 90,
    borderBottomRightRadius: 90,
    alignSelf: 'center',
  },

  textHeadCard: {
    fontFamily: 'Kanit-Light',
    fontSize: 24,
    color: '#FFF',
    alignSelf: 'center',
    padding: 20,
  },

  textNameCard: {
    fontFamily: 'Kanit-Light',
    fontSize: 20,
    color: '#000',
    alignSelf: 'center',
    padding: 15,
  },

  totalMembersCard: {
    fontFamily: 'Kanit-Light',
    fontSize: 13,
    color: '#000',
    alignSelf: 'center',
    justifyContent: 'flex-end',
    padding: 10,
  },

  cardListInfo: {
    fontFamily: 'Kanit-Light',
    flex: 0.6,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 15,
  },

  cardListMember: {
    fontFamily: 'Kanit-Light',
    flex: 1,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 15,
  },

  buttonLoginWith: {
    fontFamily: 'Kanit-Light',
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
});
