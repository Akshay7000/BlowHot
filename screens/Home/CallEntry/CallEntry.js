import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import {Dropdown} from 'react-native-element-dropdown';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Icon from 'react-native-vector-icons/Feather';
import DatePicker from '../../components/DatePicker';
import theme1 from '../../components/styles/DarkTheme';
import TextInputField from '../../components/TextInputField';
import {host} from '../../Constants/Host';
import AuthStore from '../../Mobx/AuthStore';
import {widthPercentageToDP as wp} from '../../responsiveLayout/ResponsiveLayout';

const {width, height} = Dimensions.get('window');

function CallEntry({navigation, route}) {
  let masterid = '';
  let rout = '';
  if (typeof route.params == 'undefined') {
    rout = 'none';
  } else {
    rout = route.params.routing;
  }
  const nav = useNavigation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [searchedCity, setSearchedCity] = useState('');
  const [searchedName, setSearchedName] = useState('');
  const [searchedUser, setSearchedUser] = useState({});
  const [searchedUserList, setSearchedUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [searchingCustomerCity, setSearchingCustomerCity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [callTypeItems, setCallTypeItems] = useState([]);
  const [callTypeId, setCallTypeId] = useState();

  const [remarks, setRemarks] = useState();

  const [date, setDate] = useState();
  const [followUpDate, setFollowUpDate] = useState();

  const [sales_or_group, setProductList] = useState([
    {brandid: '', so_qty: '', productid: '', model: '', dsirn: ''},
  ]);
  const [productItems, setProductItems] = useState([]);
  const [brandItems, setBrandItems] = useState([]);
  const [modelItems, setModelItems] = useState([]);

  const [location, setLocation] = useState();

  useFocusEffect(
    React.useCallback(() => {
      clear();
      getLocation();
    }, []),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let todayDate = moment(new Date()).format('DD/MM/YYYY');
      setDate(todayDate);
      setFollowUpDate(todayDate);
      getLocation();
    });
    return unsubscribe;
  }, [navigation]);

  const clear = () => {
    setSearchedUser({});
    setRemarks('');
    setProductList([
      {brandid: '', so_qty: '', productid: '', model: '', dsirn: ''},
    ]);
    setMobileNumber('');
    setSearchedCity('');
    setSearchedName('');
    setSearchedUser('');
    setSearchedUserList('');
    setFilteredUserList('');
    setSearchingCustomer('');
    setSearchingCustomerCity('');
  };

  useEffect(() => {
    const init = async () => {
      PromisData(masterid);
      getStartDay();
    };
    init();
  }, []);

  const getStartDay = async () => {
    setLoading(false);
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;

    await fetch(
      `${host}/attendance/mobattendance_list?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${new Date()}&end_date=${new Date()}`,
      data,
    )
      .then(response => response.json())
      .then(data => {
        const obj = data.atd[data.atd.length - 1];
        console.log(data.atd.length);
        if (data.atd.length === 0) {
          Alert.alert('Message', 'Please firstly, Start your day', [
            {
              text: 'Ok',
              onPress: () => {
                nav.navigate('Attendance');
              },
            },
          ]);
        }
        setLoading(true);
      })
      .catch(e => {
        console.log('Error on loading --> ', e);
        setLoading(true);
      });
  };

  //Dealers List

  const PromisData = async () => {
    setLoading(false);
    // var diler = getDealers(masterid);
    var calls = getCallType(AuthStore?.masterId);
    var product = getProducts(AuthStore?.masterId);
    Promise.all([calls, product]).then(values => {
      // setDealerItems(values[0]);
      setCallTypeItems(values[0]);
      setBrandItems(values[1]?.brand);
      // setProductItems(values[1]?.products);
      setModelItems(values[1]?.model);
      setLoading(true);
    });
  };

  // const getDealers = async masterid => {
  //   console.log('dealers');

  //   const data = {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };
  //   return await fetch(
  //     `${host}/c_visit_entry/mob_calldealer?masterid=${masterid}`,
  //     data,
  //   )
  //     .then(response => response.json())
  //     .then(data => {
  //       // console.log("dtaa", data)
  //       var responseData = [...dealerItems];
  //       data.results.map(dat =>
  //         responseData.push({id: dat._id, name: dat.ACName}),
  //       );
  //       return responseData;
  //     });
  // };

  //Call Type List

  const getCallType = async masterid => {
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return await fetch(
      `${host}/c_visit_entry/mob_getcall?masterid=${masterid}`,
      data,
    )
      .then(response => response.json())
      .then(data => {
        // console.log("dtaa", data)
        var responseData = [...callTypeItems];
        data.results.map(dat =>
          responseData.push({id: dat.id, name: dat.CallType}),
        );

        return responseData;
      });
  };

  // Product List
  const getProducts = async masterid => {
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return await fetch(
      `${host}/c_visit_entry/mob_productname?masterid=${masterid}`,
      data,
    )
      .then(response => response.json())
      .then(data => {
        let products = [];

        data.product.map(dat => products.push({id: dat._id, name: dat.Fg_Des}));
        let brand = [];
        data.brand.map(dat => brand.push({id: dat._id, name: dat.Description}));
        let model = [];
        data.model.map(dat => model.push({id: dat._id, name: dat.Description}));
        return {brand, products, model};
      });
  };

  const getProductByModal = async (name, i) => {
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(
      `${host}/c_visit_entry/mob_modelname?masterid=${AuthStore?.masterId}&modelname=${name}`,
      data,
    )
      .then(response => response.json())
      .then(data => {
        let d = [...productItems];
        d[i] = data?.results;
        setProductItems(d);
      });
  };

  const handleProductClick = i => {
    setProductList([
      ...sales_or_group,
      {brandid: '', so_qty: '', productid: '', model: '', dsirn: ''},
    ]);
  };

  const handleRemoveClick = index => {
    const list = [...sales_or_group];
    let d = [...productItems];
    list.splice(index, 1);
    d.splice(index, 1);
    setProductItems(d);
    setProductList(list);
  };

  // Change Product
  const handleProductDetails = (value, index, name) => {
    const list = [...sales_or_group];
    list[index][name] = value;
    setProductList(list);
  };

  const getLocation = async () => {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      pos => {
        setLocation(pos);
      },
      error => {
        console.log('Permission to access location was denied');
      },
      {enableHighAccuracy: true},
    );
  };

  // Submit Start Day Details
  const submitData = async () => {
    if (!searchedUser?._id) {
      return Alert.alert('select User');
    }
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;

    sales_or_group.map((item, index) => {
      item.dsirn = index + 1;
    });

    let array = sales_or_group;
    const body = {
      so_date: date,
      buy_podt: followUpDate,
      c_j_s_p: 'CVE',
      vouc_code: '1',
      Ship_party: searchedUser?._id,
      buy_rmks: remarks,
      ac_cty: callTypeId,
      user: user,
      compid: compid,
      divid: divid,
      long: location?.coords?.longitude,
      lat: location?.coords?.latitude,
      masterid: masterid,
      sales_or_group: array,
    };
    // console.log("body", body)
    axios({
      method: 'POST',
      url: `${host}/c_visit_entry/mobadd`,
      data: body,
    })
      .then(response => {
        // console.log('Response ---> ', JSON.stringify(response.data));
        if (response.data.success) {
          Toast.showWithGravity('Data Submitted.', Toast.LONG, Toast.BOTTOM);
          let todayDate = moment(new Date()).format('DD/MM/YYYY');
          setDate(todayDate);
          setFollowUpDate(todayDate);
          clear();
          nav.navigate('Home');
        } else {
          Alert.alert('User Already exist. Please use different mobile number');
        }
      })
      .catch(e => {
        console.log('Error --> ', e);
      });
  };

  const searchCustomer = () => {
    if (mobileNumber?.length === 10) {
      setSearchingCustomer(true);
      axios
        .get(
          `${host}/c_visit_entry/mob_calldealermob?MobileNo=${mobileNumber}&masterid=${AuthStore?.masterId}`,
        )
        .then(res => {
          if (res.data.results.length > 0) {
            setSearchedUser({
              _id: res?.data?.results[0]?._id,
              ACName: res?.data?.results[0]?.ACName,
            });
            setSearchingCustomer(false);
          } else {
            setSearchingCustomer(false);
            Alert.alert('No user found', 'try another number', [
              {
                text: 'Ok',
                onPress: () => {
                  navigation.navigate('Add Party');
                },
              },
            ]);
          }
        })
        .catch(e => {
          setSearchingCustomer(false);
          console.log('Mobile Res Error --> ', e);
        });
    } else {
      ToastAndroid.showWithGravity(
        'Enter Correct Mobile Number!',
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }
  };

  const searchCustomerByCity = () => {
    if (searchedCity?.length > 1) {
      setSearchingCustomerCity(true);

      axios
        .get(
          `${host}/c_visit_entry/mob_calldealercity?masterid=${AuthStore?.masterId}&cityname=${searchedCity}`,
        )
        .then(res => {
          if (res?.data?.results?.length > 0) {
            setSearchedUserList(res?.data?.results);
            setFilteredUserList(res?.data?.results);
            setSearchingCustomerCity(false);
          } else {
            setSearchingCustomerCity(false);
          }
        })
        .catch(e => {
          setSearchingCustomerCity(false);
          console.log('City Res Error --> ', e);
        })
        .finally(() => {
          console.log('City Finally --> ');
        });
    }
  };

  const searchByName = name => {
    if (name?.length > 0) {
      const data = searchedUserList?.filter(a =>
        a.ACName.toLowerCase().includes(name?.toLowerCase()),
      );
      setFilteredUserList(data);
    } else {
    }
  };

  return (
    <>
      {loading ? (
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <View style={styles.form}>
            <View style={[styles.column]}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#222'}}>Date</Text>
                <DatePicker
                  date={date}
                  placeholder={'Select Date'}
                  setDate={setDate}
                  conatinerStyles={{
                    width: wp('40%'),
                    borderRadius: 5,
                    margin: 10,
                    borderColor: '#ccc',
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'column',

                  alignItems: 'center',
                }}>
                <Text style={{color: '#222'}}>Follow Up Date</Text>
                <DatePicker
                  date={followUpDate}
                  placeholder={'Select Date'}
                  setDate={setFollowUpDate}
                  conatinerStyles={{
                    width: wp('40%'),
                    borderRadius: 5,
                    margin: 10,
                    borderColor: '#ccc',
                  }}
                />
              </View>
            </View>

            <View
              style={[
                styles.column,
                {
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  justifyContent: 'space-between',
                  marginHorizontal: 8,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                },
              ]}>
              <TextInput
                style={{
                  height: 40,
                  width: '90%',
                  color: '#222',
                }}
                returnKeyType="search"
                enablesReturnKeyAutomatically={true}
                placeholder="Search by City"
                placeholderTextColor={'#BBB'}
                value={searchedCity}
                onChangeText={text => setSearchedCity(text)}
                onEndEditing={() => {
                  searchCustomerByCity();
                }}
              />
              {!searchingCustomerCity ? (
                <TouchableOpacity onPress={() => searchCustomerByCity()}>
                  <EvilIcons name={'search'} size={30} color="#222" />
                </TouchableOpacity>
              ) : (
                <ActivityIndicator />
              )}
            </View>
            {searchedUserList.length > 0 && (
              <View
                style={[
                  styles.column,
                  {
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    justifyContent: 'space-between',
                    marginHorizontal: 8,
                    marginTop: 5,
                    paddingHorizontal: 10,
                    alignItems: 'center',
                  },
                ]}>
                <TextInput
                  style={{
                    height: 40,
                    width: '90%',
                    color: '#222',
                  }}
                  // keyboardType={'phone-pad'}
                  returnKeyType="search"
                  enablesReturnKeyAutomatically={true}
                  placeholder="Search by name"
                  placeholderTextColor={'#BBB'}
                  value={searchedName}
                  onChangeText={text => {
                    searchByName(text);
                    setSearchedName(text);
                  }}
                />
              </View>
            )}
            {filteredUserList?.length > 0 && (
              <ScrollView
                style={{
                  height: 200,
                  backgroundColor: theme1.White,
                  borderRadius: 8,
                  borderColor: theme1.LIGHT_ORANGE_COLOR,
                }}>
                {filteredUserList?.map((singleUser, ind) => (
                  <TouchableOpacity
                    key={ind}
                    onPress={() => {
                      setSearchedUser(singleUser);
                      setSearchedUserList([]);
                      setFilteredUserList([]);
                    }}>
                    <View
                      style={{
                        backgroundColor: theme1.LIGHT_ORANGE_COLOR,
                        flexDirection: 'row',
                        width: '90%',
                        alignSelf: 'center',
                        height: 40,
                        borderRadius: 8,
                        margin: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: theme1?.White,
                          backgroundColor: theme1?.LIGHT_ORANGE_COLOR,
                          // width: '30%',
                        }}>
                        {singleUser?.ACName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <View
              style={[
                styles.column,
                {
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  justifyContent: 'space-between',
                  marginHorizontal: 8,
                  marginTop: 5,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                },
              ]}>
              <TextInput
                style={{
                  height: 40,
                  width: '90%',
                  color: '#222',
                }}
                keyboardType={'phone-pad'}
                returnKeyType="search"
                enablesReturnKeyAutomatically={true}
                placeholder="Customer Mobile"
                placeholderTextColor={'#BBB'}
                value={mobileNumber}
                onChangeText={text => setMobileNumber(text)}
              />
              {!searchingCustomer ? (
                <TouchableOpacity onPress={() => searchCustomer()}>
                  <EvilIcons name={'search'} size={30} color="#222" />
                </TouchableOpacity>
              ) : (
                <ActivityIndicator />
              )}
            </View>
            <View style={[styles.column, {marginTop: 5}]}>
              <TextInput
                style={{
                  width: wp('85%'),
                  borderWidth: 1,
                  height: 40,
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  borderColor: '#ccc',
                  color: '#222',
                }}
                editable={false}
                placeholder="Customer Name"
                placeholderTextColor={'#BBB'}
                value={searchedUser?.ACName}
              />
            </View>
            {/* <View style={styles.column}>
              <TextInput
                style={{
                  width: wp('40%'),
                  borderWidth: 1,
                  height: 40,
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  borderColor: '#ccc',
                  color: '#222',
                }}
                editable={false}
                placeholder="State"
                placeholderTextColor={'#BBB'}
                value={searchedUser?.StateName?.StateName}
              />
              <TextInput
                style={{
                  width: wp('40%'),
                  borderWidth: 1,
                  height: 40,
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  borderColor: '#ccc',
                  color: '#222',
                }}
                editable={false}
                placeholder="City"
                placeholderTextColor={'#BBB'}
                value={searchedUser?.CityName?.CityName}
              />
            </View> */}

            <View style={[styles.column, {marginTop: 5}]}>
              <TextInput
                style={{
                  width: wp('85%'),
                  borderWidth: 1,
                  height: 40,
                  borderRadius: 5,
                  paddingHorizontal: 15,
                  borderColor: '#ccc',
                  color: '#222',
                }}
                placeholder="Remarks"
                placeholderTextColor={'#BBB'}
                value={remarks}
                onChangeText={text => setRemarks(text)}
              />
            </View>

            <View
              style={{
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                marginTop: 5,
              }}
            />

            <View style={{marginTop: 30}}>
              {sales_or_group.map((item, i) => {
                return (
                  <View key={i} style={styles.card}>
                    <View
                      style={{
                        width: 70,
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        justifyContent: 'flex-end',
                      }}>
                      {sales_or_group?.length - 1 === i && (
                        <TouchableOpacity
                          style={{marginHorizontal: 15}}
                          onPress={() => handleProductClick(i)}>
                          <Icon
                            name="plus-circle"
                            size={25}
                            color={theme1.LIGHT_ORANGE_COLOR}
                          />
                        </TouchableOpacity>
                      )}
                      {sales_or_group?.length !== 1 && (
                        <TouchableOpacity
                          // style={{marginHorizontal: 5}}
                          onPress={() => handleRemoveClick(i)}>
                          <Icon
                            name="minus-circle"
                            size={25}
                            color={theme1.LIGHT_ORANGE_COLOR}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.column}>
                      <Dropdown
                        data={modelItems}
                        labelField="name"
                        valueField="id"
                        value={item?.model || ''}
                        placeholder="Select model"
                        placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                        onChange={item => {
                          getProductByModal(item?.name, i);
                          handleProductDetails(item.id, i, 'model');
                        }}
                        search={true}
                        searchPlaceholder="Search"
                        style={{
                          width: '48%',
                          height: 40,
                          marginTop: 10,
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
                        selectedTextStyle={{
                          color: theme1.SemiBlack,
                          fontSize: 12,
                        }}
                        itemTextStyle={{fontSize: 12}}
                        containerStyle={{borderRadius: 8}}
                        itemContainerStyle={{borderRadius: 8}}
                        iconColor={theme1.LIGHT_ORANGE_COLOR}
                      />

                      <Dropdown
                        data={productItems[i] || []}
                        labelField="Fg_Des"
                        valueField="_id"
                        value={item.productid || ''}
                        placeholder="Select product"
                        placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                        onChange={item => {
                          // setProductId(item.id);
                          handleProductDetails(item.id, i, 'productid');
                        }}
                        search={true}
                        searchPlaceholder="Search"
                        style={{
                          width: '48%',
                          height: 40,
                          marginTop: 10,
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
                        selectedTextStyle={{
                          color: theme1.SemiBlack,
                          fontSize: 12,
                        }}
                        itemTextStyle={{fontSize: 12}}
                        containerStyle={{borderRadius: 8}}
                        itemContainerStyle={{borderRadius: 8}}
                        iconColor={theme1.LIGHT_ORANGE_COLOR}
                      />
                    </View>
                    <View style={styles.column}>
                      <Dropdown
                        data={brandItems || []}
                        labelField="name"
                        valueField="id"
                        value={item.brandid || ''}
                        placeholder="Select brand"
                        placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                        onChange={item => {
                          // setBrandId(item.id);
                          handleProductDetails(item.id, i, 'brandid');
                        }}
                        search={true}
                        searchPlaceholder="Search"
                        style={{
                          width: '48%',
                          height: 40,
                          marginTop: 10,
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
                        selectedTextStyle={{
                          color: theme1.SemiBlack,
                          fontSize: 12,
                        }}
                        itemTextStyle={{fontSize: 12}}
                        containerStyle={{borderRadius: 8}}
                        itemContainerStyle={{borderRadius: 8}}
                        iconColor={theme1.LIGHT_ORANGE_COLOR}
                      />

                      <TextInputField
                        label="Quantity"
                        placeHolder="enter quantity"
                        type={'numeric'}
                        value={item?.so_qty || ''}
                        onChangeText={value =>
                          handleProductDetails(value, i, 'so_qty')
                        }
                        style={{
                          width: '48%',
                          height: 40,
                          marginTop: 10,
                          borderRadius: 5,
                        }}
                      />

                      {/* <TextInput
                        keyboardType="numeric"
                        name="so_qty"
                        style={[
                          styles.input,
                          {
                            backgroundColor: '#D3FD7A',
                            width: wp('39%'),
                            height: hp('5.5'),
                            marginTop: 5,
                            color: '#222',
                          },
                        ]}
                        placeholder="Quantity"
                        placeholderTextColor={'#BBB'}
                        onFocus={() => onFocusChange('so_qty', i)}
                        onBlur={() => onBlurChange('so_qty', i)}
                        ref={element => (bagRefs.current[i] = element)}
                        defaultValue={item.so_qty}
                        onChangeText={value =>
                          handleProductDetails(value, i, 'so_qty')
                        }
                      /> */}
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={[styles.column, {justifyContent: 'center'}]}>
              <TouchableOpacity
                onPress={() => submitData()}
                style={styles.button1}>
                <Text style={{color: 'white'}}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
        </View>
      )}
    </>
  );
}

export default observer(CallEntry);

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
    justifyContent: 'space-around',
    marginHorizontal: wp('0.3%'),
    // marginVertical: hp('0.8%'),
    // alignItems: "center",
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
  },
  input: {
    height: wp('10%'),
    // flex: 1,
    width: wp('22%'),
    // borderStartWidth: 2,
    // borderColor: "grey",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  progress: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 350,
  },

  form: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    height: height,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    top: 4,
    left: 0,
    backgroundColor: theme1.DARK_ORANGE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('80%'),
    top: 4,
    left: 0,
    backgroundColor: theme1.DARK_ORANGE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollView: {},
  selectButtonTitle: {
    padding: 10,
    fontSize: 18,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    // elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  heading: {
    flex: 1,
    backgroundColor: theme1.LIGHT_BLUE_COLOR,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    color: 'black',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
});
