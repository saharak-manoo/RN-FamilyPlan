import { Dimensions, StyleSheet, Platform } from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_ANDROID = Platform.OS === 'android';

export const styles = StyleSheet.create({
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
});