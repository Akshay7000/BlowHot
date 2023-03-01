import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { Button, Searchbar } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';
import DatePicker from '../components/DatePicker';
import SelectTwo from '../components/SelectTwo';
import { host } from '../Constants/Host';
import AuthStore from '../Mobx/AuthStore';

import { observer } from 'mobx-react-lite';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from '../responsiveLayout/ResponsiveLayout';

const ComingSoon = ({navigation, route}) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [searchName, setSearchName] = useState();
  const [page, setPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selllerId, setSellerId] = useState();
  const [sellerItems, setSellerItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState();
  const [inputBox, setShowInputBox] = useState(false);
  const [shareItem, setShareItem] = useState();

  const [cityItems, setCityItems] = useState([]);
  const [stateItems, setStateItems] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getTelphoneList();
    });
    return unsubscribe;
  }, [navigation]);

  const handleSellerId = item => {
    setPhoneNumber(item.mobile);
    setSellerId(item.id);
    setShowInputBox(true);
  };

  var RBref = useRef();

  const shareToWhatsAppWithContact = () => {
    var item = JSON.stringify(shareItem).split(',');
    var i;
    var shareText = 'From :' + ' Demo' + '\n';
    for (i = 0; i < item.length; i++) {
      shareText += item[i] + '\n';
    }
    shareText.replace('{', ' ');
    shareText.replace('}', ' ');
    Linking.openURL(
      `whatsapp://send?text=${shareText}&phone=+91${phoneNumber}`,
    );
  };

  const getTelphoneList = async () => {
    const URL = `${host}/claim_status/mobgetclaimstatuslist`;
    Axios.post(URL, {user: AuthStore?.user}).then(response => {
      setData(response.data.s_callSchema);
      setTableData(response.data.s_callSchema);
      setLoading(false);

      //  getSellers()
    });
  };

  // Seller lIst
  const getSellers = async () => {
    const masterid = AuthStore?.masterId;
    const dat = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(
      `http://www.softsauda.com/deal_entry/party_listS?ptyp=S&masterid=${masterid}`,
      dat,
    )
      .then(response => response.json())
      .then(dat => {
        dat.results.map(da =>
          setSellerItems(oldArray => [
            ...oldArray,
            {id: da.id, name: da.party_name, mobile: da.mob_no},
          ]),
        );

        getCity();
      });
  };

  // Get City List

  const getCity = async () => {
    const URL = `http://www.softsauda.com/add_city/getcitylist`;

    Axios.get(URL).then(response => {
      response.data.city_name.map(dat =>
        setCityItems(oldArray => [
          ...oldArray,
          {id: dat._id, name: dat.city_name},
        ]),
      );
      getState();
    });
  };

  //Get State List
  const getState = async () => {
    const URL = `http://www.softsauda.com/add_city/getstatelist`;

    Axios.get(URL).then(response => {
      setStateItems(response.data.state_name);

      setLoading(false);
    });
  };

  const getFilteredData = async (startDate, endDate) => {
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;

    const URL = `${host}/attendance/mobattendance_list?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${startDate}&end_date=${endDate}`;
    console.log(URL);
    Axios.get(URL).then(response => {
      setData(response.data.atd);
      setTableData(response.data.atd);
      setLoading(false);
      //  getSellers()
    });
  };

  const filter = (text, type) => {
    const array = [...tableData];
    const newArray = array.filter(table =>
      table.name.ACName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(newArray);
  };

  const toogleModal = id => {
    setLoading(true);
    var item = data.find(item => item._id === id);
    setShareItem({
      'PARTY-NAME': item.party_name,
      ADDRESS: item.address1,
      CITY: item.city_name.city_name,
      'PHONE NUMBER': item.mob_no,
      'PAN NUMBER': item.pan_no,
      'GSTIN NUMBER': item.gstin,
      'FSSAI NUMBER': item.fssai,
    });
    setLoading(false);
    setIsModalVisible(true);
  };

  const fetchMoreTelephone = () => {
    setPage(page + 1);
    getTelphoneList();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      {!loading ? (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Modal
              isVisible={isModalVisible}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              animationInTiming={1000}
              onBackdropPress={() => setIsModalVisible(false)}
              onSwipeComplete={() => setIsModalVisible(false)}
              swipeDirection="left"
              height={hp('100%')}>
              <View style={[styles.card, {height: hp('40%')}]}>
                <Button onPress={() => setIsModalVisible(false)}>
                  <Text>Hide</Text>
                </Button>
                <View style={styles.column}>
                  <SelectTwo
                    items={sellerItems}
                    selectedItem={selectedItems}
                    handleId={handleSellerId}
                    width={wp('80%')}
                    placeholder="Seller"
                  />
                </View>

                {inputBox ? (
                  <>
                    <View style={{borderWidth: 1, borderColor: 'grey'}}></View>
                    <View style={styles.column}>
                      <TextInput
                        style={[styles.input]}
                        placeholder="Deal No."
                        defaultValue={phoneNumber}
                        onChangeText={text => setPhoneNumber(text)}
                      />
                      <TouchableOpacity
                        onPress={() => shareToWhatsAppWithContact()}>
                        <Button>
                          <Text>Share </Text>
                        </Button>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <></>
                )}
              </View>
            </Modal>
            <Searchbar
              placeholder="Search"
              defaultValue={searchName}
              onChangeText={text => filter(text)}
              style={{
                borderWidth: 0.5,
                width: wp('90%'),
                height: hp('4.5%'),
                flex: 0.97,
                marginLeft: 10,
                marginTop: 10,
                padding: 5,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={{
                height: hp('6%'),
                flex: 0.1,
                marginLeft: 10,
                backgroundColor: '#D9D9D9',
                borderRadius: 10,
                marginTop: 5,
                paddingLeft: 10,
                paddingRight: 10,
                marginRight: 8,
              }}
              onPress={() => RBref.open()}>
              <Icon
                name="filter"
                size={wp('7%')}
                color="black"
                style={{top: 5}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 0.5,
              marginBottom: 0,
              padding: 0,
              margin: 10,
            }}
          />

          <View>
            <RBSheet
              ref={ref => {
                RBref = ref;
              }}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                  backgroundColor: theme1.LIGHT_BLUE_COLOR,
                },
              }}>
              <ScrollView keyboardShouldPersistTaps="always">
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      width: wp('10%'),
                      flex: 0.35,
                      marginTop: 22,
                      fontSize: wp('3%'),
                    }}>
                    Start Date:
                  </Text>
                  <DatePicker
                    style={{
                      width: wp('80%'),
                      borderRadius: 5,
                      margin: 10,
                      flex: 0.65,
                    }}
                    date={startDate}
                    mode="date"
                    placeholder="Date"
                    format="DD/MM/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 40000,
                        top: 9,
                        marginLeft: 0,
                        height: hp('2.8%'),
                        width: wp('3.5%'),
                      },
                      dateInput: {
                        borderRadius: 10,
                        marginRight: 15,
                        height: hp('4%'),
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      setStartDate(date);
                    }}
                  />
                  <Text
                    style={{
                      width: wp('10%'),
                      flex: 0.3,
                      marginTop: 22,
                      fontSize: wp('3%'),
                    }}>
                    End Date:
                  </Text>
                  <DatePicker
                    style={{
                      width: wp('80%'),
                      borderRadius: 5,
                      margin: 10,
                      flex: 0.7,
                    }}
                    date={endDate}
                    mode="date"
                    placeholder="Date"
                    format="DD/MM/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 40000,
                        top: 9,
                        marginLeft: 0,
                        height: hp('2.8%'),
                        width: wp('3.5%'),
                      },
                      dateInput: {
                        borderRadius: 10,
                        marginRight: 15,
                        height: hp('4%'),
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      setEndDate(date);
                    }}
                  />
                </View>

                <View style={[styles.column, {justifyContent: 'center'}]}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={() => getFilteredData(startDate, endDate)}>
                    <Text style={{color: 'white'}}>Show</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </RBSheet>
          </View>

          <ScrollView style={styles.card} horizontal={true}>
            <Grid>
              <Row>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('37%')}>
                  <Text style={{fontWeight: 'bold'}}>Unique Id</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('33%')}>
                  <Text style={{fontWeight: 'bold'}}>Service Center</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('25%')}>
                  <Text style={{fontWeight: 'bold'}}>Date</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('30%')}>
                  <Text style={{fontWeight: 'bold'}}>Time</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={{fontWeight: 'bold'}}>Type of Call</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={{fontWeight: 'bold'}}>Warranty</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={{fontWeight: 'bold'}}>Distance</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={{fontWeight: 'bold'}}>Call Charges</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={{fontWeight: 'bold'}}>TA</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={{fontWeight: 'bold'}}>Balance</Text>
                </Col>
              </Row>

              <FlatList
                data={data}
                renderItem={({item, index}) => (
                  <>
                    {index == 0 ? (
                      <View style={{borderWidth: 0.5}}></View>
                    ) : (
                      <></>
                    )}
                    <Row style={{marginBottom: 10, marginTop: 10}}>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('38%')}>
                        <Text>{item.unique_id}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('32%')}>
                        <Text>{item.call_center.ServiceCenterName}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('25%')}>
                        <Text>
                          {item.so_date
                            .substring(0, 10)
                            .split('-')
                            .reverse()
                            .join('/')}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('30%')}>
                        <Text>{item.time}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('38%')}>
                        <Text>{item?.typ_call?.CallType}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text>{item.warranty_type}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text>{item?.end_millometer_reading}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text>{item?.visit_charges}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text>{item?.visit_charges}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text>{item?.visit_charges}</Text>
                      </Col>
                    </Row>
                    <View style={{borderWidth: 0.5}}></View>
                  </>
                )}
                keyExtractor={(item, index) => index}
                onEndReached={fetchMoreTelephone}
                onEndReachedThreshold={0.1}
              />
            </Grid>
          </ScrollView>
        </>
      ) : (
        <ActivityIndicator size="large" color="skyblue" />
      )}
    </ScrollView>
  );
};

export default observer(ComingSoon);

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  singleHead: {width: 80, height: 40, backgroundColor: '#c8e1ff'},
  title: {backgroundColor: '#f6f8fa'},
  titleText: {textAlign: 'center'},
  text: {textAlign: 'center'},
  btn: {
    width: 58,
    height: 18,
    marginHorizontal: 7,
    backgroundColor: '#c8e1ff',
    borderRadius: 2,
    justifyContent: 'center',
  },
  btnText: {textAlign: 'center'},
  cnt: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('95%'),
    backgroundColor: theme1.DARK_BLUE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
    marginLeft: 10,
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
    marginBottom: 10,
  },
  input: {
    height: 35,
    flex: 1,
    width: wp('22%'),
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
});
