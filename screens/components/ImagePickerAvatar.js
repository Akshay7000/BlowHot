import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {Button} from 'react-native-paper';
import {images} from '../../assets';
import theme1 from '../components/styles/DarkTheme';
const {width, height} = Dimensions.get('window');

export function ImagePickerAvatar({uri, onPress, editable}) {
  return (
    <ImageBackground
      style={styles.imageBackground}
      source={images.whatsappBackground}>
      <View style={styles.avatar}>
        <Image
          style={styles.avatarImage}
          source={uri ? {uri} : images.avatar}
        />
        <Button
          icon="camera"
          mode="contained"
          onPress={onPress}
          style={{backgroundColor: theme1.DARK_ORANGE_COLOR}}
          disabled={editable}>
          Add a Photo
        </Button>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  avatar: {
    alignItems: 'center',
    marginTop: '10%',
  },
  avatarImage: {
    height: height / 4,
    width: width / 2,
    overflow: 'hidden',
    borderColor: 'grey',
    borderWidth: 2,
    marginBottom: 10,
  },
  addButton: {
    height: 54,
    width: 54,

    position: 'absolute',
    right: 104,
    bottom: 40,
  },
  addButtonIcon: {
    height: 54,
    width: 54,
    marginTop: 30,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
});
