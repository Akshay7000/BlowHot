import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios, {Axios} from 'axios';
import {observer} from 'mobx-react-lite';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme1 from '../../components/styles/DarkTheme';
import {host} from '../../Constants/Host';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../responsiveLayout/ResponsiveLayout';
import AuthStore from '../../Mobx/AuthStore';

const Landing = () => {
  const navigation = useNavigation();
  const isFocused = navigation?.isFocused();
  const [AllData, setAllData] = useState([]);

  const attendanceHandler = () => {
    navigation.navigate('Attendance');
  };

  const attendanceListHandler = () => {
    navigation.navigate('Attendance List');
  };

  const callVisitEntryHandler = () => {
    navigation.navigate('Call Visit Entry');
  };

  const callVisitEntryListHandler = () => {
    navigation.navigate('Call Visit Entry List');
  };

  const callSummaryHandler = () => {
    navigation.navigate('Call Summary');
  };

  const claimStatusHandler = () => {
    navigation.navigate('Claim Status');
  };

  const comingSoonHandler = () => {
    navigation.navigate('Claim Status');
  };

  const getAllData = async () => {
    try {
      if (AuthStore?.masterId) {
        console.log(
          '=> ',
          `${host}/call_summary/mobcall_summarydb?masterid=${AuthStore?.masterId}&user=${AuthStore?.user}&compid=${AuthStore?.companyId}&divid=${AuthStore?.divisionId}&administrator=${AuthStore?.adminId}`,
        );
        axios
          .post(
            `${host}/call_summary/mobcall_summarydb?masterid=${AuthStore?.masterId}&user=${AuthStore?.user}&compid=${AuthStore?.companyId}&divid=${AuthStore?.divisionId}&administrator=${AuthStore?.adminId}`,
          )
          .then(res => {
            console.log('All data --> ', res?.data?.s_call);
            setAllData(res?.data?.s_call);
          });
      }
    } catch (error) {
      console.log('Error on get All Data --> ', error);
    }
  };

  useEffect(() => {
    getAllData();
  }, [AuthStore?.divisionId, isFocused]);

  useEffect(() => {
    const use = async () => {
      var startDate = moment(await AsyncStorage.getItem('startingDate')).format(
        'DD/MM/YYYY',
      );
      var endDate = moment(await AsyncStorage.getItem('endDate')).format(
        'DD/MM/YYYY',
      );
      var divisionCode = await AsyncStorage.getItem('divisionName');
      navigation.setOptions({
        headerTitle: () => {
          return (
            <View style={{diplay: 'flex', flexDirection: 'row'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: wp('4.5%'),
                  marginTop: 5,
                  color: theme1.GreyWhite,
                }}>
                Home
              </Text>
              <View
                style={{
                  diplay: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginLeft: 30,
                }}>
                <Text style={{fontWeight: 'bold', color: theme1.GreyWhite}}>
                  {divisionCode}
                </Text>
                <Text style={{fontWeight: 'bold', color: theme1.GreyWhite}}>
                  {startDate.substring(3, 10)}-{endDate.substring(3, 10)}
                </Text>
              </View>
            </View>
          );
        },
      });
    };
    use();
  }, []);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={{paddingBottom: 20}}>
          <View style={[styles.container1, styles.row]}>
            <View style={[styles.card]}>
              <TouchableOpacity
                style={[styles.icon]}
                activeOpacity={0.8}
                onPress={() => attendanceHandler()}>
                <MaterialCommunityIcons
                  name="handshake-outline"
                  size={50}
                  color={theme1.MEDIUM_ORANGE_COLOR}
                />

                <Text style={styles.text}>Attendance</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.card]}>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => callVisitEntryHandler()}>
                <MaterialCommunityIcons
                  name="file-document-edit-outline"
                  size={50}
                  color={theme1.MEDIUM_ORANGE_COLOR}
                />
                <Text style={styles.text}>Call Visit Entry</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container1, styles.row]}>
            <View style={[styles.card]}>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => attendanceListHandler()}>
                <FontAwesome
                  name="book"
                  size={50}
                  color={theme1.MEDIUM_ORANGE_COLOR}
                />
                <Text style={styles.text}>Attendance List</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.card]}>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => callVisitEntryListHandler()}>
                <MaterialCommunityIcons
                  name="notebook-check-outline"
                  size={50}
                  color={theme1.MEDIUM_ORANGE_COLOR}
                />
                <Text style={styles.text}>Visit List</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.container1, styles.row]}>
            <View style={[styles.card]}>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => callSummaryHandler()}>
                <MaterialCommunityIcons
                  name="notebook"
                  size={50}
                  color={theme1.MEDIUM_ORANGE_COLOR}
                />
                <Text style={styles.text}>Call Summary</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.card]}>
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => comingSoonHandler()}>
                <MaterialCommunityIcons
                  name="notebook-outline"
                  size={50}
                  color={theme1.MEDIUM_ORANGE_COLOR}
                />
                <Text style={styles.text}>Claim Status</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            {AllData?.length > 0 && (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: theme1.LIGHT_ORANGE_COLOR,
                  width: '90%',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                {AllData?.map((d, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginVertical: 5,
                      }}>
                      <Text
                        style={[
                          styles.text,
                          {width: '45%'},
                        ]}>{`${d?._id?.call_pending} : -`}</Text>
                      <Text style={[styles.text, {width: '45%'}]}>
                        {d.count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
        <View
          style={{
            textAlign: 'center',
            justifyContent: 'center',
            backgroundColor: theme1.DARK_ORANGE_COLOR,
            height: hp('9%'),
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
          }}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('http://softsauda.com/userright/login')
            }
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: `${host}/public/img/logo.png `,
              }}
              style={{
                height: hp('10%'),
                width: wp('25%'),
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: wp('3.5%'),
                color: '#E9E9E9',
                fontWeight: 'bold',
              }}>
              {' '}
              ©2023 Blowhot - Future Perfect
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default observer(Landing);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 4,
    left: 0,
    backgroundColor: 'skyblue',
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  image: {
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 15,
    paddingRight: 0,
  },
  appButtonContainer: {
    elevation: 8,
    width: wp('42%'),
    height: hp('16%'),
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  appButtonText: {
    fontSize: wp('5%'),
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
    marginTop: 10,
  },
  container1: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appButtonContainer1: {
    elevation: 8,
    width: wp('44%'),
    height: hp('16%'),
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  appButtonText1: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
    marginTop: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#E9E9E9',
    height: hp('100%'),
    marginBottom: 60
  },
  icon: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: wp('4.2%'),
    color: theme1.MEDIUM_ORANGE_COLOR,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  card: {
    width: '45%',
    backgroundColor: '#E9E9E9',
    borderWidth: 1.5,
    borderColor: theme1.MEDIUM_ORANGE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
