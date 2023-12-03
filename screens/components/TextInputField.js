import React from 'react';
import {View} from 'react-native';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import theme1 from '../components/styles/DarkTheme';

const TextInputField = ({
  label,
  type,
  value,
  style,
  isPassword,
  onChangeText,
  onEnd = () =>{},
  leftIcon,
  placeHolder,
  disable = false
}) => {

  return (
    <View
      style={[
        {
          width: '90%',
          height: 50,
          alignSelf: 'center',
          backgroundColor: '#fff',
          style,
        },
        style,
      ]}>
      <FloatingLabelInput
        label={label}
        value={value}
        hintTextColor={theme1.GreyWhite}
        hint={placeHolder}
        leftComponent={leftIcon}
        animationDuration={300}
        editable={!disable}
        keyboardType={type ? type : 'default'}
        containerStyles={{
          borderWidth: 1,
          backgroundColor: theme1.White,
          borderColor: theme1.LIGHT_ORANGE_COLOR,
          borderRadius: 8,
          paddingLeft: 18,
        }}
        customLabelStyles={{
          colorFocused: theme1.LIGHT_ORANGE_COLOR,
          colorBlurred: theme1.LIGHT_ORANGE_COLOR,
          fontSizeFocused: 15,
          topFocused: -25,
          leftFocused: -10,
        }}
        labelStyles={{
          backgroundColor: theme1.White,
          color: theme1.GreyWhite,
          paddingHorizontal: 5,
        }}
        inputStyles={{
          color: theme1.SemiBlack,
          paddingLeft: 10,
          fontSize: 12
        }}
        onChangeText={value => {
          onChangeText(value);
        }}
        onEndEditing={()=>{
          onEnd();
        }}
      />

      {/* {isPassword && (
        <FloatingLabelInput
          isPassword
          togglePassword={secure}
          customShowPasswordComponent={<EYE_OPEN />}
          customHidePasswordComponent={<EYE_OPEN />}
          label={label}
          value={value}
          hintTextColor={theme1.GreyWhite}
          hint={placeHolder}
          leftComponent={leftIcon}
          animationDuration={300}
          keyboardType={type ? type : 'default'}
          containerStyles={{
            borderWidth: 1,
            backgroundColor: theme1.White,
            borderColor: theme1.LIGHT_ORANGE_COLOR,
            borderRadius: 8,
            paddingLeft: 18,
          }}
          customLabelStyles={{
            colorFocused: theme1.LIGHT_ORANGE_COLOR,
            colorBlurred: theme1.GreyWhite,
            fontSizeFocused: 15,
            topFocused: -25,
            leftFocused: -10,
          }}
          labelStyles={{
            backgroundColor: theme1.White,
            color: theme1.GreyWhite,
            paddingHorizontal: 5,
          }}
          inputStyles={{
            color: theme1.SemiBlack,
            paddingLeft: 10,
          }}
          onChangeText={value => {
            onChangeText(value);
          }}
        />
      )} */}
    </View>
  );
};

export default TextInputField;
