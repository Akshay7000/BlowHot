import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import SelectMultiple from 'react-native-select-multiple';
import AuthStore from '../../Mobx/AuthStore';
import TextInputField from '../../components/TextInputField';
import theme1 from '../../components/styles/DarkTheme';
import { widthPercentageToDP as wp } from '../../responsiveLayout/ResponsiveLayout';

const AddParty = () => {
  const nav = useNavigation();
  const checkList = [
    {value: 'Appliances', label: 'Appliances'},
    {value: 'Crockery', label: 'Crockery'},
    {value: 'Dealer', label: 'Dealer'},
    {value: 'Direct Marketing', label: 'Direct Marketing'},
    {value: 'Distributor', label: 'Distributor'},
    {value: 'Electronics', label: 'Electronics'},
    {value: 'Hardware & Sanitary', label: 'Hardware & Sanitary'},
    {value: 'Multibrand', label: 'Multibrand'},
    {value: 'Others', label: 'Others'},
  ];

  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(true);

  const [name, setName] = useState();
  const [acCode, setAcCode] = useState();
  const [pan, setPan] = useState();
  const [mobile, setMobile] = useState();
  const [address, setAddress] = useState();
  const [area, setArea] = useState();
  const [gstin, setGstin] = useState();
  const [pincode, setPincode] = useState();
  const [website, setWebsite] = useState();
  const [email, setEmail] = useState();
  const [resiNumber, setResiNumber] = useState();
  const [fax, setFax] = useState();
  const [alt, setAlt] = useState();

  const [selectedCityItems, setSelectedCityItems] = useState([]);
  const [cityId, setCityId] = useState();
  const [cityItems, setCityItems] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    getCity();
  }, []);

  const getCity = async () => {
    setLoading(false);
    const URL = `${AuthStore?.host}/c_visit_entry/mob_getcity`;
    axios
      .get(URL)
      .then(response => {
        setCityItems(response?.data?.results);
        setLoading(true);
      })
      .catch(error => {
        setLoading(true);
        console.log('error', error);
      });
  };

  const clear = () => {
    setName('');
    setAcCode('');
    setPan('');
    setMobile('');
    setAddress('');
    setArea('');
    setGstin('');
    setPincode('');
    setAlt('');
    setCityId('');
    setSelectedCityItems([]);
    setSelectedItems([]);
  };

  useEffect(() => {
    if (name === undefined || name.length == 0 || email === "") setDisabled(true);
    else if (cityId === undefined || cityId.length == null) setDisabled(true);
    else setDisabled(false);
  }, [cityId, name]);

  const handleSubmit = () => {
    const submit = async () => {
      var string = '';
      selectedItems.map((item, i) => {
        if (i == 0) {
          string = string + item.value;
        } else {
          string = string + ',' + item.value;
        }
      });
      if (!mobile) {
        alert('Please Enter Mobile No.');
        return;
      }

      setLoading(false);
      const body = {
        party_radio: string,
        ac_code: acCode,
        ac_name: name,
        ac_pan: pan,
        ac_add1: address,
        ac_area: area,
        ac_gstin: gstin,
        ac_city: cityId,
        ac_pincode: pincode,
        ac_website: website,
        ac_altno: alt,
        ac_email: email,
        ac_phmob: mobile,
        ac_phres: resiNumber,
        ac_phfax: fax,
        del: 'N',
        user: AuthStore?.user,
        masterid: AuthStore?.masterId,
      };

      console.log('bodd', body);

      axios({
        method: 'POST',
        url: `${AuthStore?.host}/party_master/mobparty_master_add`,
        data: body,
      })
        .then(respone => {
          // console.log(respone.data.success);
          if (respone.data.success) {
            ToastAndroid.showWithGravity(
              'Party Added',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            clear();
            nav.goBack();
            setLoading(true);
          } else {
            setLoading(true);
            Alert.alert(
              'User Already exist. Please use different mobile number',
            );
          }
        })
        .catch(e => {
          setLoading(false);
          console.log('error -> ', e);
        });
    };
    submit();
  };

  const onSelectionsChange = selectedItems => {
    console.log(selectedItems);
    // selectedFruits is array of { label, value }
    setSelectedItems(selectedItems);
  };

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <SelectMultiple
            items={checkList}
            selectedItems={selectedItems}
            onSelectionsChange={onSelectionsChange}
            labelStyle={{color: theme1.SemiBlack}}
            horizontal={true}
            rowStyle={{
              borderColor: theme1.LIGHT_ORANGE_COLOR,
              width: '90%',
              alignSelf: 'center',
              marginVertical: 5,
              borderRadius: 8,
              borderWidth: 1,
              borderBottomWidth: 1,
              borderBottomColor: theme1.LIGHT_ORANGE_COLOR,
            }}
          />

          <View style={styles.form}>
            <View style={styles.row}>
              {cityItems.length > 0 && (
                <Dropdown
                  data={cityItems}
                  labelField="CityName"
                  valueField="_id"
                  value={cityId || ''}
                  placeholder="Select City"
                  placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                  onChange={item => {
                    setCityId(item?._id);
                  }}
                  search={true}
                  searchPlaceholder="Search"
                  style={{
                    width: '48%',
                    marginTop: 15,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingLeft: 5,
                    borderColor: theme1.LIGHT_ORANGE_COLOR,
                  }}
                  inputSearchStyle={{
                    color: theme1.SemiBlack,
                  }}
                  activeColor={theme1.LIGHT_ORANGE_COLOR}
                  selectedTextStyle={{color: theme1.SemiBlack, fontSize: 12}}
                  itemTextStyle={{fontSize: 12}}
                  containerStyle={{borderRadius: 8}}
                  itemContainerStyle={{borderRadius: 8}}
                  iconColor={theme1.LIGHT_ORANGE_COLOR}
                />
              )}
              <TextInputField
                label="AC. Code"
                placeHolder="enter AC. Code"
                value={acCode}
                type={'numeric'}
                onChangeText={setAcCode}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
            </View>

            <View style={styles.row}>
              <TextInputField
                label="Name"
                placeHolder="enter name"
                value={name}
                onChangeText={setName}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
              <TextInputField
                label="Pan Number"
                placeHolder="Enter Pan Number"
                value={pan}
                onChangeText={setPan}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
            </View>

            <View style={styles.row}>
              <TextInputField
                label="Address"
                placeHolder="Enter Address"
                value={address}
                onChangeText={setAddress}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
              <TextInputField
                label="Area"
                placeHolder="Enter Area"
                value={area}
                onChangeText={setArea}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
            </View>

            <View style={styles.row}>
              <TextInputField
                label="Mobile"
                placeHolder="Enter Mobile"
                value={mobile}
                type={'numeric'}
                onChangeText={setMobile}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
              <TextInputField
                label="Alt. Mobile"
                placeHolder="Enter Alt. Mobile"
                value={alt}
                type={'numeric'}
                onChangeText={setAlt}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
            </View>

            <View style={styles.row}>
              <TextInputField
                label="GSTIN"
                placeHolder="Enter GSTIN"
                value={gstin}
                onChangeText={setGstin}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
              <TextInputField
                label="Pin Code"
                placeHolder="Enter Pin Code"
                value={pincode}
                type={'numeric'}
                onChangeText={setPincode}
                style={{
                  width: '48%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
            </View>

            <View style={styles.row}>
              <TextInputField
                label="Email"
                placeHolder="Enter Email"
                value={email}
                onChangeText={setEmail}
                style={{
                  width: '100%',
                  height: 40,
                  marginTop: 15,
                  borderRadius: 5,
                }}
              />
            </View>

            <View style={[styles.column, {justifyContent: 'center'}]}>
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={disabled ? styles.button : styles.button1}
                disabled={disabled}>
                <Text style={{color: 'white'}}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
        </View>
      )}
    </View>
  );
};

export default observer(AddParty);

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '40%',
    height: '30%',
    top: -10,
    left: 120,
  },
  dealnumber: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  input: {
    height: 35,
    flex: 1,
    width: wp('90%'),
    color: '#222',
    borderStartWidth: 2,
    borderColor: 'grey',
    borderEndWidth: 0.5,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    margin: 4,
    padding: 8,
    borderRadius: 5,
  },
  progress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },

  form: {
    width: '95%',
    marginTop: 10,
    borderRadius: 15,
    alignSelf: 'center',
    backgroundColor: theme1.White,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90%'),
    top: 4,
    left: 0,
    backgroundColor: theme1.GreyWhite,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('90%'),
    top: 4,
    left: 0,
    backgroundColor: theme1.DARK_ORANGE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
