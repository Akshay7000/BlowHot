//import liraries
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { observer } from 'mobx-react';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import barcodeStore from '../../Mobx/BarcodeStore';
import TextInputField from '../../components/TextInputField';
import theme1 from '../../components/styles/DarkTheme';
import {
  widthPercentageToDP as wp
} from '../../responsiveLayout/ResponsiveLayout';
import AuthStore from '../../Mobx/AuthStore';

const {height, width} = Dimensions.get('window');
// create a component
const BarCodeDetail = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      barcodeStore?.barCodeData && getDetail();
    }, []),
  );

  useEffect(() => {
    if (!isFocused) {
      barcodeStore?.setBarCodeData('');
      barcodeStore?.setBarCodeDetail({});
    }
    PermissionsAndroid.request('android.permission.CAMERA');
  }, [isFocused]);

  const getDetail = async () => {
    try {
      barcodeStore?.setLoading(true);
      const res = await axios({
        method: 'POST',
        url: `${AuthStore?.host}/WIP_entry/brcodedetail`,
        data: {
          dataval: barcodeStore?.barCodeData,
        },
      });
      if (res?.data?.success) {
        console.log(res?.data?.results);
        barcodeStore?.setBarCodeDetail(res?.data?.results);
        barcodeStore?.setLoading(false);
      }else{
        barcodeStore?.setLoading(false);
        barcodeStore?.setBarCodeDetail({});
        Toast.showWithGravity(
          'Please Try Again..',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    } catch (e) {
      barcodeStore?.setLoading(false);
      Toast.showWithGravity(
        'Please Try Again..',
        Toast.LONG,
        Toast.BOTTOM,
      );
      console.log('Error on get Detail --> ', e);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={barcodeStore?.isLoading}
        transparent
        style={{
          flex: 1,
        }}>
        <View
          style={{
            height: height,
            width: '100%',
            backgroundColor: '#FFF',
            opacity: 0.6,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={theme1.LIGHT_ORANGE_COLOR} />
        </View>
      </Modal>
      <TextInputField
        label="Bar Code"
        placeHolder="enter bar code"
        value={barcodeStore?.barCodeData}
        onChangeText={data => {
          barcodeStore?.setBarCodeData(data);
        }}
        style={styles.input_text}
      />
      <Text style={{fontSize: 16, fontWeight: '400', marginVertical: 10}}>
        Or
      </Text>

      <TouchableOpacity
        style={[styles.button1, {marginTop: 0}]}
        onPress={() => {
          barcodeStore?.setBarCodeData('');
          navigation.navigate('scanCode');
        }}>
        <Text style={{color: 'white'}}>Scan</Text>
      </TouchableOpacity>

      {barcodeStore?.barCodeData && (
        <TouchableOpacity
          style={styles.button1}
          onPress={() => {
            getDetail();
          }}>
          <Text style={{color: 'white'}}>Submit</Text>
        </TouchableOpacity>
      )}

      {barcodeStore?.barCodeDetail?.so_date && (
        <View style={styles.detail_card}>
          <View style={styles.detail_view}>
            <Text style={styles.detail_label}>MFG. Date:- </Text>
            <Text style={styles.detail_value}>
              {moment(barcodeStore?.barCodeDetail?.so_date).format(
                'DD/MM/YYYY',
              )}
            </Text>
          </View>
          <View style={styles.detail_view}>
            <Text style={styles.detail_label}>Brand:- </Text>
            <Text style={styles.detail_value}>
              {
                barcodeStore?.barCodeDetail?.sales_or_group[0]?.so_disc
                  ?.Fg_Brand?.Description
              }
            </Text>
          </View>
          <View style={styles.detail_view}>
            <Text style={styles.detail_label}>Product:- </Text>
            <Text style={styles.detail_value}>
              { barcodeStore?.barCodeDetail?.sales_or_group[0]?.so_disc
                  ?.Fg_Model?.Description}
            </Text>
          </View>
          <View style={styles.detail_view}>
            <Text style={styles.detail_label}>Model:- </Text>
            <Text style={styles.detail_value}>
              {barcodeStore?.barCodeDetail?.sales_or_group[0]?.so_disc?.Fg_Des}
            </Text>
          </View>
          <View style={styles.detail_view}>
            <Text style={styles.detail_label}>Batch:- </Text>
            <Text style={styles.detail_value}>
              {barcodeStore?.barCodeDetail?.so_datemilisecond}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    height: 40,
    backgroundColor: theme1.DARK_ORANGE_COLOR,
    marginTop: 20,
    borderRadius: 10,
  },
  input_text: {
    width: '95%',
    height: 40,
    marginTop: 15,
    borderRadius: 5,
  },
  detail_card: {
    width: '90%',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 30,
    paddingVertical: 15,
    borderColor: theme1?.DARK_ORANGE_COLOR,
  },
  detail_view: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
  },
  detail_label: {
    color: theme1?.DARK_ORANGE_COLOR,
    fontSize: 16,
    fontWeight: '600',
    width: 100
  },
  detail_value: {
    color: theme1?.HEADER_TEXT_COLOR,
    fontSize: 14,
    fontWeight: '500',
    width: '70%'
  },
});

//make this component available to the app
export default observer(BarCodeDetail);
