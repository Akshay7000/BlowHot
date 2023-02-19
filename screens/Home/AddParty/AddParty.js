import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View
} from 'react-native';
import { Row } from 'react-native-easy-grid';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import SelectMultiple from 'react-native-select-multiple';
import SelectTwo from '../../components/SelectTwo';
import theme1 from '../../components/styles/DarkTheme';
// import * as Updates from "expo-updates";
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { host } from '../../Constants/Host';
import AuthStore from '../../Mobx/AuthStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from '../../responsiveLayout/ResponsiveLayout';

const AddParty = ({navigation, route}) => {
  const nav = useNavigation();
  const checkList = [
    {value: 'Retails', label: 'Retails'},
    {value: 'Dealer', label: 'Dealer'},
    {value: 'Distributor', label: 'Distributor'},
    {value: 'Customer', label: 'Customer'},
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

  // Refs

  const nameRef = useRef();
  const cityRef = useRef();
  const mobileRef = useRef();
  const addressRef = useRef();

  //Handle Ids

  const handleCityId = item => {
    setCityId(item.id);
  };
  useEffect(() => {
    getCity();
  }, []);

  const getCity = async () => {
    console.log('hey');
    const URL = `${host}/c_visit_entry/mob_getcity`;

    axios
      .get(URL)
      .then(response => {
        // console.log("response", response.data.results)
        response.data.results.map(dat =>
          setCityItems(oldArray => [
            ...oldArray,
            {id: dat._id, name: String(dat.CityName)},
          ]),
        );
        setLoading(true);
      })
      .catch(error => console.log('error', error));
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
    if (name === undefined || name.length == 0) setDisabled(true);
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
      console.log('mob', mobile);
      if (!mobile) {
        alert('Please Enter Mobile No.');
        return;
      }

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
        url: `${host}/party_master/mobparty_master_add`,
        data: body,
      }).then(respone => {
        console.log(respone, 'resonse');
        ToastAndroid.showWithGravity(
          'Party Added',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        clear();
        nav.goBack();
      });
    };
    submit();
    //Seller Broker--T
    //Buyer Broker--R
  };

  const onSelectionsChange = selectedItems => {
    console.log(selectedItems);
    // selectedFruits is array of { label, value }
    setSelectedItems(selectedItems);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {loading ? (
        <>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={styles.container}>
            <SelectMultiple
              items={checkList}
              selectedItems={selectedItems}
              onSelectionsChange={onSelectionsChange}
              labelStyle={{color: '#222'}}
            />

            <View style={styles.form}>
              <Row style={{marginBottom: 10}}>
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="AC. Code"
                  placeholderTextColor={'#BBB'}
                  keyboardType="numeric"
                  defaultValue={acCode}
                  onChangeText={text => setAcCode(text)}
                />

                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="Name"
                  placeholderTextColor={'#BBB'}
                  defaultValue={name}
                  onChangeText={text => setName(text)}
                />
              </Row>
              <Row style={{marginBottom: 10}}>
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="Pan Number"
                  placeholderTextColor={'#BBB'}
                  defaultValue={pan}
                  onChangeText={text => setPan(text)}
                />
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="Enter Address"
                  placeholderTextColor={'#BBB'}
                  defaultValue={address}
                  onChangeText={text => setAddress(text)}
                />
              </Row>
              <Row style={{marginBottom: 10}}>
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="Area"
                  placeholderTextColor={'#BBB'}
                  defaultValue={area}
                  onChangeText={text => setArea(text)}
                />
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="GSTIN"
                  placeholderTextColor={'#BBB'}
                  defaultValue={gstin}
                  onChangeText={text => setGstin(text)}
                />
              </Row>

              <Row style={{marginBottom: 10}}>
                <SelectTwo
                  items={cityItems}
                  selectedItem={selectedCityItems}
                  handleId={handleCityId}
                  width={wp('92%')}
                  placeholder="City"
                  borderColor="#ccc"
                />
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="Pincode"
                  placeholderTextColor={'#BBB'}
                  keyboardType="numeric"
                  defaultValue={pincode}
                  onChangeText={text => setPincode(text)}
                />
              </Row>

              {/* <Row style={{ marginBottom: 10 }}>
                <TextInput
                  style={[styles.input, { backgroundColor: "#D3FD7A" }]}
                  placeholder="Webiste"
                  defaultValue={website}
                  onChangeText={(text) => setWebsite(text)}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: "#D3FD7A" }]}
                  placeholder="Email"
                  defaultValue={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </Row> */}

              <Row style={{marginBottom: 10}}>
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="Mobile no."
                  placeholderTextColor={'#BBB'}
                  required
                  keyboardType="numeric"
                  defaultValue={mobile}
                  onChangeText={text => setMobile(text)}
                />
                <TextInput
                  style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                  placeholder="No/Alt"
                  placeholderTextColor={'#BBB'}
                  defaultValue={alt}
                  onChangeText={text => setAlt(text)}
                />
              </Row>

              {/* <Row style={{ marginBottom: 10 }}>
                <TextInput
                  style={[styles.input, { backgroundColor: "#D3FD7A" }]}
                  placeholder="Resi no."
                  defaultValue={resiNumber}
                  onChangeText={(text) => setResiNumber(text)}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: "#D3FD7A" }]}
                  placeholder="Fax"
                  defaultValue={fax}
                  onChangeText={(text) => setFax(text)}
                />
              </Row> */}

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
        </>
      ) : (
        <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
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
    flex: 1,
    top: 0,
    marginTop: 30,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    height: hp('100%'),
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
});
