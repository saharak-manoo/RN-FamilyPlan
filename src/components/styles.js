import { Dimensions, StyleSheet, Platform } from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_ANDROID = Platform.OS === 'android';

export const styles = StyleSheet.create({
  colorBlue: {
    color: '#278EF5'
  },

  homeComponent: {
    backgroundColor: '#278EF5'
  },

  colorGreen: {
    color: '#036A35'
  },

  addComponent: {
    backgroundColor: '#036A35'
  },

  settingsComponent: {
    backgroundColor: '#DA044B'
  },

  profileComponent: {
    backgroundColor: '#167EFA'
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