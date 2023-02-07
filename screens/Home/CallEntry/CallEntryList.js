import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from '../../components/DatePicker';
import {ScrollView} from 'react-native-gesture-handler';
import {List, Searchbar} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';
import theme1 from '../../components/styles/DarkTheme';
import {host} from '../../Constants/Host';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../responsiveLayout/ResponsiveLayout';
import { observer } from 'mobx-react-lite';
import AuthStore from '../../Mobx/AuthStore';

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
      url: `${host}/c_visit_entry/mob_visitlist?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${start}&end_date=${end}`,
    }).then(response => {
      console.log(
        'Call Visit Entry List ---->  ',
        response.data.c_visit_entrySchema,
      );
      setTableData(response.data.c_visit_entrySchema);
      setFilteredData(response.data.c_visit_entrySchema);
    });
    setLoading(false);
  };

  const filter = text => {
    setSearchName(text);
    const array = [...tableData];
    const newArray = array.filter(
      table =>
        table?.Ship_party?.ACName?.toLowerCase()?.includes(
          text.toLowerCase(),
        ) || table?.ac_cty?.call?.toLowerCase()?.includes(text.toLowerCase()),
    );
    setFilteredData(newArray);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      {!loading ? (
        <>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 0.5,
              marginBottom: 0,
              padding: 0,
              margin: 0,
            }}
          />

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
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => RBref.open()}>
              <Icon name="filter" size={wp('7%')} color="black" />
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
            {filteredData?.map(dat => (
              <>
                <List.Section style={{top: 8}}>
                  <List.Accordion
                    title={`Dealer Name:${dat.Ship_party?.ACName}`}
                    titleStyle={{color: theme1.SemiBlack}}
                    description={`Call Type:${dat.ac_cty?.call}`}
                    left={props => (
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          padding: 10,
                          borderRightWidth: 0.6,
                        }}>
                        <Text style={{fontSize: 15, color: '#222'}}>
                          {dat.vouc_code}.
                        </Text>
                        <Text style={{fontSize: 10, color: '#222'}}>
                          {new Date(dat.so_date).toDateString()}
                        </Text>
                      </View>
                    )}>
                    {dat.sales_or_group.map((prod, i) => (
                      <>
                        <View
                          style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            marginBottom: 0,
                            padding: 0,
                            margin: 0,
                          }}
                        />

                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
                          }}>
                          <List.Item
                            title="Product"
                            description={prod.so_disc?.Fg_Des}
                            index={i}
                            style={{
                              marginTop: 5,
                              flex: 0.3,
                              borderRightWidth: 0.8,
                              borderColor: theme1.GreyWhite
                            }}
                          />
                          <List.Item
                            title="Brand"
                            index={i}
                            description={prod.brandid?.Description}
                            style={{
                              marginTop: 5,
                              flex: 0.3,
                              borderRightWidth: 0.8,
                              borderColor: theme1.GreyWhite
                            }}
                          />
                          <List.Item
                            title="Model"
                            index={i}
                            description={prod.model?.Description}
                            style={{
                              marginTop: 5,
                              flex: 0.3,
                              borderRightWidth: 0.8,
                              borderColor: theme1.GreyWhite
                            }}
                          />
                          <List.Item
                            title="Quantity"
                            index={i}
                            description={prod.so_qty}
                            style={{marginTop: 5, flex: 0.3}}
                          />
                        </View>
                      </>
                    ))}
                  </List.Accordion>
                </List.Section>
                <View
                  style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: 0.5,
                    marginBottom: 0,
                    padding: 0,
                    margin: 0,
                  }}
                />
              </>
            ))}

            <RBSheet
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
                      conatinerStyles={{
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
                      conatinerStyles={{
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
            </RBSheet>
          </View>
        </>
      ) : (
        <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
      )}
    </ScrollView>
  );
}

export default observer(CallEntryList);
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
});
