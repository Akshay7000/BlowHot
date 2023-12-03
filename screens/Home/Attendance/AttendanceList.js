import Axios from 'axios';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { ScrollView } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';
import DatePicker from '../../components/DatePicker';
import theme1 from '../../components/styles/DarkTheme';
import { sortArrayByDate } from '../../Constants/array';
import { host } from '../../Constants/Host';
import AuthStore from '../../Mobx/AuthStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from '../../responsiveLayout/ResponsiveLayout';

function AttendanceList({navigation}) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [searchName, setSearchName] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      getTelphoneList();
    });
  }, [navigation]);

  let RBref = useRef();

  // const shareToWhatsAppWithContact = () => {
  //   var item = JSON.stringify(shareItem).split(',');
  //   var i;
  //   var shareText = 'From :' + ' Demo' + '\n';
  //   for (i = 0; i < item.length; i++) {
  //     shareText += item[i] + '\n';
  //   }
  //   shareText.replace('{', ' ');
  //   shareText.replace('}', ' ');
  //   Linking.openURL(
  //     `whatsapp://send?text=${shareText}&phone=+91${phoneNumber}`,
  //   );
  // };

  const getTelphoneList = async () => {
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;

    const URL = `${AuthStore?.host}/attendance/mobattd_list?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${new Date()}&end_date=${new Date()}`;
    Axios.get(URL).then(response => {
      setData(response?.data?.atd);
      setTableData(response?.data?.atd);
      setFilteredData(sortArrayByDate(response?.data?.atd, 'Start_date'));
      setLoading(false);
    });
  };

  const getFilteredData = async (startDate, endDate) => {
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;

    const URL = `http://103.231.46.238:5000/attendance/mobattd_list?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${startDate}&end_date=${endDate}`;
    
    Axios.get(URL).then(response => {
      setData(response?.data?.atd);
      setFilteredData(sortArrayByDate(response?.data?.atd, 'Start_date'));
      setLoading(false);
      RBref.current.close();
      //  getSellers()
    });
  };

  const filter = text => {
    const array = [...tableData];
    const newArray = array.filter(table => {
      if (
        table.name.ACName.toLowerCase().includes(text?.toLowerCase()) ||
        moment(new Date(table?.Start_date).toDateString())
          .format('DD-MM-YYYY')
          .includes(text) ||
        moment(new Date(table?.end_date).toDateString())
          .format('DD-MM-YYYY')
          .includes(text) ||
        String(table?.MilloMeterReading)?.includes(text) ||
        String(table?.end_millometer_reading)?.includes(text) ||
        table?.Remark?.toLowerCase()?.includes(text?.toLowerCase()) ||
        table?.end_remark?.toLowerCase()?.includes(text?.toLowerCase()) 
      ) {
        return table;
      }
    });
    setFilteredData(newArray);
  };

  return (
    <ScrollView style={{flex: 1}}>
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
            <TouchableOpacity
              style={{
                height: hp('6%'),
                flex: 0.1,
                marginLeft: 10,
                backgroundColor: theme1.LIGHT_ORANGE_COLOR,
                borderRadius: 10,
                marginTop: 5,
                paddingLeft: 10,
                paddingRight: 10,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => RBref.current.open()}>
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
            <RBSheet
              ref={RBref}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                  backgroundColor: theme1.Grey,
                },
              }}>
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
                      color: theme1.SemiBlack,
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
                      borderColor: theme1.MEDIUM_ORANGE_COLOR,
                      marginTop: 0,
                    }}
                    placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                    date={startDate}
                    placeholder="Start Date"
                    setDate={setStartDate}
                  />
                </View>

                <View>
                  <Text
                    style={{
                      marginVertical: 12,
                      fontSize: wp('3%'),
                      color: theme1.SemiBlack,
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
                      borderColor: theme1.MEDIUM_ORANGE_COLOR,
                      marginTop: 0,
                    }}
                    placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                    date={endDate}
                    placeholder="End Date"
                    setDate={setEndDate}
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
                  onPress={() => getFilteredData(startDate, endDate)}>
                  <Text style={{color: 'white'}}>Show</Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
          </View>

          <ScrollView style={styles.card} horizontal={true}>
            <Grid>
              <Row>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={styles.colText}>Name</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('30%')}>
                  <Text style={styles.colText}>Start Date</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('20%')}>
                  <Text style={styles.colText}>Start Time</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('30%')}>
                  <Text style={styles.colText}>Start MilloMeter</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={styles.colText}>Start Remark</Text>
                </Col>
                {/*<Col style={{marginRight:20,borderRightWidth:0.5}} width={wp("40%")}><Text style={{fontWeight:"bold"}}>End Day</Text></Col>*/}
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={styles.colText}>End Date</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={styles.colText}>End Time</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={styles.colText}>End MilloMeter</Text>
                </Col>
                <Col
                  style={{marginRight: 20, borderRightWidth: 0.5}}
                  width={wp('40%')}>
                  <Text style={styles.colText}>End Remark</Text>
                </Col>
              </Row>

              <FlatList
                data={filteredData}
                initialNumToRender={10}
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
                        width={wp('39%')}>
                        <Text style={{color: '#222'}}>{item.name.ACName}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('32%')}>
                        <Text style={{color: '#222'}}>
                          {moment(
                            new Date(item?.Start_date).toDateString(),
                          ).format('DD-MM-YYYY')}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('18%')}>
                        <Text style={{color: '#222'}}>{item.Time}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('30%')}>
                        <Text style={{color: '#222'}}>
                          {item.MilloMeterReading}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('38%')}>
                        <Text style={{color: '#222'}}>{item.Remark}</Text>
                      </Col>
                      {/*
  <Col style={{marginRight:20,flex:1,borderRightWidth:0.5,paddingRight:10}} width={wp("40%")}><Text>{item.endday}</Text></Col>*/}
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text style={{color: '#222'}}>
                          {moment(
                            new Date(item?.end_date).toDateString(),
                          ).format('DD-MM-YYYY')}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text style={{color: '#222'}}>{item?.end_time}</Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text style={{color: '#222'}}>
                          {item?.end_millometer_reading}
                        </Text>
                      </Col>
                      <Col
                        style={{
                          marginRight: 20,
                          flex: 1,
                          borderRightWidth: 0.5,
                          paddingRight: 10,
                        }}
                        width={wp('40%')}>
                        <Text style={{color: '#222'}}>{item?.end_remark}</Text>
                      </Col>
                    </Row>
                    <View style={{borderWidth: 0.5}}></View>
                  </>
                )}
                keyExtractor={(item, index) => index}
              />
            </Grid>
          </ScrollView>
        </>
      ) : (
        <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
      )}
    </ScrollView>
  );
}

export default observer(AttendanceList);

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
    backgroundColor: theme1.DARK_ORANGE_COLOR,
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
  colText: {
    color: '#222',
    fontWeight: 'bold',
  },
});
