//import liraries
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react';
import React from 'react';
import BarcodeScanner from 'react-native-scan-barcode';
import barcodeStore from '../../Mobx/BarcodeStore';

// create a component
const ScanCode = () => {
  const navigation = useNavigation();
  return (
    <BarcodeScanner
      onBarCodeRead={e => {
        console.log(e.data);
        if (barcodeStore?.barCodeData !== e?.data) {
          barcodeStore?.setBarCodeData(e?.data);
          navigation.goBack();
        }
      }}
      style={{flex: 1}}
      torchMode={'off'}
      cameraType={'back'}
    />
  );
};

//make this component available to the app
export default observer(ScanCode);
