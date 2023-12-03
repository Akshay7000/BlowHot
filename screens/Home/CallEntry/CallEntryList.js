import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import AuthStore from '../../Mobx/AuthStore';
import theme1 from '../../components/styles/DarkTheme';
import { widthPercentageToDP as wp } from '../../responsiveLayout/ResponsiveLayout';

function CallEntryList({navigation}) {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState();
  const [searchName, setSearchName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState();

  var RBref = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let todayDate = moment(new Date()).format('DD/MM/YYYY');
      let date = moment(await AsyncStorage.getItem('startingDate')).format(
        'DD/MM/YYYY',
      );

      setStartDate(date);
      setEndDate(todayDate);
      getDealerList(date, todayDate, 0);
    });
    return unsubscribe;
  }, [navigation]);

  const getDealerList = async (start, end) => {
    setLoading(true);
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;
    Axios({
      method: 'GET',
      url: `${AuthStore?.host}/c_visit_entry/mob_visitlist?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${start}&end_date=${end}`,
    }).then(response => {
      console.log(
        'Call Visit Entry List ---->  ',
        response.data.c_visit_entrySchema,
      );

      setTableData(filterArrayByDate(response?.data?.c_visit_entrySchema,'desc', 'so_date'));
      setFilteredData(filterArrayByDate(response?.data?.c_visit_entrySchema,'desc', 'so_date'));
    });
    setLoading(false);
  };

  const filterArrayByDate = (
    arr = [],
    mode = 'desc',
    dateKey = 'so_date',
  ) => {
    return arr.sort(function (a, b) {
      if (
        a != null &&
        b != null &&
        typeof a == 'object' &&
        typeof b == 'object' &&
        dateKey in a &&
        dateKey in b
      ) {
        if (mode == 'desc') {
          return moment(a[dateKey]).isBefore(moment(b[dateKey]));
        } else {
          return moment(b[dateKey]).isBefore(moment(a[dateKey]));
        }
      } else {
        return false;
      }
    });
  };

  const filter = text => {
    setSearchName(text);
    const array = [...tableData];
    const newArray = array.filter(
      table =>
        table?.Ship_party?.ACName?.toLowerCase()?.includes(
          text.toLowerCase(),
        ) ||
        moment(new Date(table?.so_date).toDateString())
          .format('DD-MM-YYYY')
          ?.includes(text) ||
        table?.ac_cty?.call?.toLowerCase()?.includes(text.toLowerCase()) ||
        String(table?.vouc_code)?.includes(text) ||
        String(table?.Ship_party?.MobileNo)?.includes(text),
    );
    setFilteredData(newArray);
  };

  return (
    <View>
      {!loading ? (
        <>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Searchbar
              placeholder="Search"
              defaultValue={searchName}
              onChangeText={text => filter(text)}
              style={{
                borderWidth: 0.5,
                width: wp('90%'),
                flex: 0.97,
                marginLeft: 10,
                marginTop: 10,
                borderRadius: 10,
              }}
            />
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

          <View style={{height: Dimensions.get('screen').height - 205}}>
            <FlatList
              data={filteredData}
              initialNumToRender={10}
              keyExtractor={item => item?.vouc_code}
              renderItem={({item}) => (
                <View
                  style={{
                    width: '90%',
                    // height: 175,
                    backgroundColor: theme1.LIGHT_ORANGE_COLOR,
                    alignSelf: 'center',
                    marginTop: 10,
                    borderRadius: 18,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignSelf: 'center',
                      alignItems: 'center',
                      marginTop: 5,
                    }}>
                    <Text style={{fontSize: 15, color: '#FFF'}}>
                      {item?.vouc_code}.
                    </Text>
                    <Text style={{fontSize: 12, color: '#FFF'}}>
                      {moment(new Date(item?.so_date).toDateString()).format(
                        'DD-MM-YYYY',
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: theme1.GreyWhite,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      width: '90%',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#FFF',
                        marginRight: 20,
                        width: '85%',
                      }}
                      numberOfLines={1}>{`${item?.Ship_party?.ACName}`}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        item?.Ship_party?.MobileNo &&
                          Linking.openURL(
                            `tel:${item?.Ship_party?.MobileNo}`,
                          ).catch(err => {
                            console.error('An error occurred', err);
                          });
                      }}>
                      <View
                        style={{
                          width: 25,
                          height: 25,
                          backgroundColor: 'green',
                          borderRadius: 15,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}>
                        <Icon name="phone" color={theme1.White} size={15} />
                      </View>
                    </TouchableOpacity>
                  </View>
                  {item?.sales_or_group.map((SG, index) => (
                    <View
                      key={index}
                      style={{width: '90%', alignSelf: 'center'}}>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Product: - </Text>
                        <Text style={styles.SgValue}>
                          {SG?.so_disc?.Fg_Des}
                        </Text>
                      </View>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Brand: - </Text>
                        <Text style={styles.SgValue}>
                          {SG?.brandid?.Description}
                        </Text>
                      </View>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Model: - </Text>
                        <Text style={styles.SgValue}>
                          {SG?.model?.Description}
                        </Text>
                      </View>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Quantity: - </Text>
                        <Text style={styles.SgValue}>{SG?.so_qty}</Text>
                      </View>
                    </View>
                  ))}
                  <View
                    style={[
                      styles.SgView,
                      {width: '90%', alignSelf: 'center', marginBottom: 10},
                    ]}>
                    <Text style={styles.SgLabel}>Contact: - </Text>
                    <Text style={styles.SgValue}>
                      {item?.Ship_party?.MobileNo}
                    </Text>
                  </View>
                </View>
              )}
            />
            {/* <RBSheet
              animationType="fade"
              ref={RBref}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                  backgroundColor: theme1.LIGHT_BLUE_COLOR,
                  height: hp('40%'),
                },
              }}>
              <ScrollView keyboardShouldPersistTaps="always">
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: 10,
                    alignSelf: 'center',
                  }}>
                  <View>
                    <Text
                      style={{
                        marginVertical: 12,
                        fontSize: wp('3%'),
                        color: '#222',
                      }}>
                      Start Date:
                    </Text>
                    <DatePicker
                      containerStyles={{
                        width: wp('42%'),
                        height: 40,
                        justifyContent: 'center',
                        borderRadius: 5,
                        marginRight: 17,
                        borderColor: '#ccc',
                        marginTop: 0,
                      }}
                      date={startDate}
                      placeholder="Date"
                      setDate={date => {
                        setStartDate(date);
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        marginVertical: 12,
                        fontSize: wp('3%'),
                        color: '#222',
                      }}>
                      End Date:
                    </Text>
                    <DatePicker
                      containerStyles={{
                        width: wp('42%'),
                        height: 40,
                        justifyContent: 'center',
                        borderRadius: 5,
                        marginRight: 17,
                        borderColor: '#ccc',
                        marginTop: 0,
                      }}
                      date={endDate}
                      placeholder="Date"
                      setDate={date => {
                        setEndDate(date);
                      }}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.column,
                    {justifyContent: 'center', marginTop: 10},
                  ]}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={() => getDealerList(startDate, endDate)}>
                    <Text style={{color: 'white'}}>Show</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </RBSheet> */}
          </View>
        </>
      ) : (
        <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
      )}
    </View>
  );
}

export default observer(CallEntryList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  singleHead: {
    width: 80,
    height: 40,
    backgroundColor: '#c8e1ff',
  },
  title: {
    backgroundColor: '#f6f8fa',
  },
  titleText: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
  },
  btnText: {
    textAlign: 'center',
  },
  btn: {
    width: 58,
    height: 18,
    marginHorizontal: 7,
    backgroundColor: '#c8e1ff',
    borderRadius: 2,
    justifyContent: 'center',
  },
  cnt: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  tabStyle: {
    borderColor: theme1.MEDIUM_BLUE_COLOR,
  },
  activeTabStyle: {
    backgroundColor: theme1.MEDIUM_BLUE_COLOR,
  },
  button1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    backgroundColor: theme1.DARK_BLUE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
  },
  ListButton: {
    width: '90%',
    height: 45,
    backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
    borderRadius: 7,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  ListButtonText: {
    textAlignVertical: 'center',
    fontSize: 14,
    color: '#FFF',
  },
  SgView: {
    flexDirection: 'row',
    marginTop: 3,
  },
  SgLabel: {
    width: '25%',
    fontSize: 13,
    color: theme1.White,
  },
  SgValue: {
    fontSize: 13,
    color: theme1.White,
  },
});
