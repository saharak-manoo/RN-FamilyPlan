import { Dimensions, StyleSheet, Platform } from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_ANDROID = Platform.OS === 'android';

export const styles = StyleSheet.create({

  defaultView: {
    flex: 1,
    backgroundColor: '#D1D1D1'
  },

  cardProfile: {
    flex: 1,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },

  profilePhoto: {
    width: 180,
    height: 180,
    borderRadius: 180 / 2
  },

  homeColor: {
    backgroundColor: '#2370E6'
  },

  chatColor: {
    backgroundColor: '#09A650'
  },

  notiColor: {
    backgroundColor: '#2370E6'
  },

  settingColor: {
    backgroundColor: '#2370E6'
  },

  listCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    justifyContent: 'center',
    marginTop: 10,
    height: (height / 5),
    width: (width / 1.1),
    borderRadius: 13,
    backgroundColor: '#FFF'
  },

  popUpModal: {
    backgroundColor: '#FFF'
  },

  overlayModal: {
    backgroundColor: 'transparent',
  },

  handleModal: {
    backgroundColor: '#C5C5C5'
  },
});