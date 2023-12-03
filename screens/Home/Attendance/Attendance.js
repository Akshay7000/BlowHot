import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Axios from 'axios';
import {observer} from 'mobx-react-lite';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import ImageCropPicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import AuthStore from '../../Mobx/AuthStore';
import DatePicker from '../../components/DatePicker';
import {ImagePickerAvatar} from '../../components/ImagePickerAvatar';
import {ImagePickerModal} from '../../components/ImagePickerModal';
import theme1 from '../../components/styles/DarkTheme';
import {widthPercentageToDP as wp} from '../../responsiveLayout/ResponsiveLayout';
import Geolocation from 'react-native-geolocation-service';

const {height} = Dimensions.get('window');

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  locationProvider: 'playServices',
});

function Attendance({navigation}) {
  const nav = useNavigation();

  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState();
  const [startDayMillometerReading, setStartDayMillometerReading] = useState(0);
  const [startDayRemarks, setStartDayRemarks] = useState('');
  const [startDayvisible, setstartDayVisible] = useState(false);
  const [startDay, setStartDay] = useState(true);
  const [endDay, setEndDay] = useState(false);
  const [startDayCurrentTime, setStartDayCurrentTime] = useState();

  const [endDate, setEndDate] = useState(new Date(Date.now()));
  const [endDayMillometerReading, setEndDayMillometerReading] = useState(0);
  const [endDayRemarks, setEndDayRemarks] = useState('');
  const [endDayvisible, setEndDayVisible] = useState(false);
  const [endDayCurrentTime, setEndDayCurrentTime] = useState();

  const [vId, setVId] = useState();
  const [image, setImage] = useState();
  const [imageDetails, setImageDetails] = useState();

  const allData = () => {
    let todayDate = moment(new Date()).format('DD/MM/YYYY');
    var ampm = new Date().getHours() >= 12 ? 'PM' : 'AM';
    let minutes = new Date().getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    var time = new Date().getHours() + ':' + minutes + ampm;
    setStartDate(todayDate);
    setStartDayCurrentTime(time);
    isLocationEnabled();
    getStartDay();
  };

  useFocusEffect(
    useCallback(() => {
      allData();
    }, []),
  );

  useEffect(() => {
    AppState.addEventListener('change',()=>{getLocation()})
  }, []);

  const getLocation = () => {
    setLoading(false);
    Geolocation.getCurrentPosition(
      position => {
        console.log(position)
        setLocation(position);
        setLoading(true);
      },
      error => {
        Alert.alert('Location not available', 'Try it again...', [
          {
            text: 'Ok',
            onPress: () => {
              getLocation();
            },
          },
        ]);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 5000,
      },
    );
  };

  const isLocationEnabled = async () => {
    let res = await DeviceInfo.isLocationEnabled();
    if (!res) {
      Alert.alert('GPS Alert', 'Please Enable GPS location to Continue...', [
        {
          text: 'Ok',
          onPress: () => {
            nav.goBack();
          },
        },
      ]);
    }
  };

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
      `${
        AuthStore?.host
      }/attendance/mobattendance_list?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${new Date()}&end_date=${new Date()}`,
      data,
    )
      .then(response => response.json())
      .then(data => {
        const obj = data.atd[data.atd.length - 1];
        let todayDate = moment(new Date()).format('YYYY-MM-DD');
        const date = obj?.Start_date?.substring(0, 10);
        const end_Date = obj?.end_date;
        const id = obj?._id;

        if (data.atd.length == 0) {
          setStartDay(true);
        } else {
          if (todayDate === date) {
            let todayDate = moment(new Date()).format('DD/MM/YYYY');
            var ampm = new Date().getHours() >= 12 ? 'PM' : 'AM';
            let minutes = new Date().getMinutes();
            if (minutes < 10) minutes = '0' + minutes;
            var time = new Date().getHours() + ':' + minutes + ampm;
            setEndDate(todayDate);
            setEndDayCurrentTime(time);
            setVId(id);
            setStartDay(false);
            setEndDay(false);
          } else {
            setEndDay(false);
            setStartDay(true);
          }
          if (date == date && end_Date == date && todayDate == date) {
            console.log('End Day true ---> ', date, todayDate, end_Date);
            setEndDay(true);
          }
        }
        setLoading(true);
        getLocation();
      })
      .catch(e => {
        console.log('Error on loading --> ', e);
        setLoading(true);
      });
  };

  const pickImage = async () => {
    try {
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.5,
      })
        .then(image => {
          setImage(image.path);
          setImageDetails(image);
          setstartDayVisible(false);
          setEndDayVisible(false);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const pickFromCamera = async () => {
    try {
      ImageCropPicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.5,
      })
        .then(async image => {
          setImage(image.path);
          setImageDetails(image);
          setstartDayVisible(false);
          setEndDayVisible(false);
        })
        .catch(err => {
          console.log(err);
        });
      setstartDayVisible(false);
    } catch (error) {
      console.log('IMAGE_PICKER_ERROR - ', error);
    }
  };

  // Submit Start Day Details
  const handleStartDaySubmit = async () => {
    try {
      setLoading(false);
      const submitData = async pos => {
        const user = AuthStore?.user;
        const masterid = AuthStore?.masterId;
        const compid = AuthStore?.companyId;
        const divid = AuthStore?.divisionId;
        const data = new FormData();
        const newImageUri =
          'file:///' + imageDetails?.path?.split('file:/')?.join('');

        data.append('image', {
          uri: imageDetails?.path,
          type: imageDetails?.mime,
          name: newImageUri?.split('/')?.pop(),
        });

        data.append('name', user);
        data.append('att_time', startDayCurrentTime);
        data.append('strt_dte', startDate);
        data.append('millometer_reading', startDayMillometerReading);
        data.append('remark', startDayRemarks);
        data.append('usrnm', user);
        data.append('photo', '');
        data.append('end_day', 'End');
        data.append('start_long', pos?.coords?.longitude);
        data.append('start_lat', pos?.coords?.latitude);
        data.append('co_code', compid);
        data.append('div_code', divid);
        data.append('masterid', masterid);
        data.append('filename', newImageUri?.split('/')?.pop());

        Axios({
          method: 'POST',
          url: `${AuthStore?.host}/attendance/startmobadd`,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          processData: false,
          contentType: false,
          data: data,
        })
          .then(respone => {
            let todayDate = moment(new Date()).format('DD/MM/YYYY');
            var ampm = new Date().getHours() >= 12 ? 'PM' : 'AM';
            let minutes = new Date().getMinutes();
            if (minutes < 10) minutes = '0' + minutes;
            var time = new Date().getHours() + ':' + minutes + ampm;
            setEndDate(todayDate);
            setEndDayCurrentTime(time);
            setStartDayRemarks('');
            setStartDayMillometerReading('');
            setImageDetails({});
            setImage(null);
            setLoading(true);
            Toast.showWithGravity('Data Submitted.', Toast.LONG, Toast.BOTTOM);
            nav.goBack();
          })
          .catch(error => {
            console.log('erron on startDay ---> ', JSON.stringify(error));
            setLoading(true);
            Toast.showWithGravity(
              'Submit data failed',
              Toast.LONG,
              Toast.BOTTOM,
            );
          });
      };
      submitData(location);
    } catch (error) {
      console.log('Error on catch --> ', error);
    }
  };

  // Submit End Day Details
  const handleEndDaySubmit = async () => {
    try {
      setLoading(false);
      const submitData = async pos => {
        const data = new FormData();
        const newImageUri =
          'file:///' + imageDetails.path.split('file:/').join('');

        data.append('image', {
          uri: imageDetails.path,
          type: 'image/jpg', //imageDetails.type,
          name: newImageUri.split('/').pop(),
        });

        data.append('end_time', endDayCurrentTime);
        data.append('end_dte', endDate);
        data.append('end_millometer_reading', endDayMillometerReading);
        data.append('end_remark', endDayRemarks);
        data.append('vhpxendday', vId);
        data.append('photo', '');
        data.append('end_day', '');
        data.append('end_long', pos?.coords.longitude);
        data.append('end_lat', pos?.coords.latitude);
        data.append('co_code', AuthStore?.companyId);
        data.append('div_code', AuthStore?.divisionId);
        data.append('masterid', AuthStore?.masterId);
        data.append('filename', newImageUri.split('/').pop());

        Axios({
          method: 'POST',
          url: `${AuthStore?.host}/attendance/mobend_add`,
          headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          processData: false,
          contentType: false,
          data: data,
        })
          .then(respone => {
            Toast.showWithGravity('Data Submitted.', Toast.LONG, Toast.BOTTOM);
            setStartDay(true);
            setStartDayRemarks('');
            setStartDayMillometerReading('');
            setImageDetails({});
            setImage(null);
            setLoading(true);
            nav.goBack();
          })
          .catch(error => {
            console.log('erron on startDay ---> ', JSON.stringify(error));
            setLoading(true);
            Toast.showWithGravity(
              'Submit data failed',
              Toast.LONG,
              Toast.BOTTOM,
            );
          });
      };
      submitData(location);
    } catch (error) {
      console.log('Error on catch --> ', error);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {loading ? (
        <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
          <View style={styles.form}>
            {!endDay && startDay && (
              <View style={styles.card}>
                <Text style={styles.heading}>Start Day</Text>
                <View style={[styles.column, {top: 0}]}>
                  <ImagePickerAvatar
                    uri={startDay ? image : ''}
                    onPress={() => pickFromCamera()}
                    editable={!startDay}
                  />
                </View>

                <View style={[styles.column, {marginTop: 12}]}>
                  <DatePicker
                    containerStyles={{
                      width: wp('42%'),
                      height: 35,
                      justifyContent: 'center',
                      borderRadius: 5,
                      marginTop: 5,
                      borderColor: '#ccc',
                    }}
                    date={startDate}
                    isDisable={true}
                    placeholder="Date"
                    setDate={date => {
                      setStartDate(date);
                    }}
                  />

                  <TextInput
                    keyboardType="numeric"
                    style={[styles.input]}
                    defaultValue={startDayCurrentTime}
                    editable={false}
                  />
                </View>

                <View style={[styles.column]}>
                  <TextInput
                    editable={startDay}
                    keyboardType="numeric"
                    style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                    placeholderTextColor="#BFBFBF"
                    placeholder="Millometer Reading"
                    defaultValue={startDayMillometerReading}
                    onChangeText={text => setStartDayMillometerReading(text)}
                  />
                  <TextInput
                    editable={startDay}
                    style={[
                      styles.input,
                      {
                        backgroundColor: '#D3FD7A',
                        width: wp('82%'),
                        flex: 0.97,
                      },
                    ]}
                    placeholder="Remarks"
                    placeholderTextColor="#BFBFBF"
                    defaultValue={startDayRemarks}
                    onChangeText={text => setStartDayRemarks(text)}
                  />
                </View>

                <View style={[styles.column, {justifyContent: 'center'}]}>
                  <TouchableOpacity
                    onPress={() => handleStartDaySubmit()}
                    style={styles.button1}
                    disabled={!startDay}>
                    <Text style={{color: 'white'}}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.form}>
            {!endDay && !startDay && (
              <View style={styles.card}>
                <Text style={styles.heading}>End Day</Text>

                <View style={[styles.column, {top: 0}]}>
                  <ImagePickerAvatar
                    uri={!startDay ? image : ''}
                    onPress={() => setstartDayVisible(true)}
                    editable={startDay}
                  />
                  <ImagePickerModal
                    isVisible={endDayvisible}
                    onClose={() => setEndDayVisible(false)}
                    onImageLibraryPress={pickImage}
                    onCameraPress={pickFromCamera}
                  />
                </View>

                <View style={[styles.column, {marginTop: 12}]}>
                  <DatePicker
                    containerStyles={{
                      width: wp('42%'),
                      height: 40,
                      justifyContent: 'center',
                      borderRadius: 5,
                      marginTop: 5,
                      borderColor: '#ccc',
                    }}
                    date={endDate}
                    isDisable={true}
                    placeholder="Date"
                    setDate={date => {
                      setEndDate(date);
                    }}
                  />

                  <TextInput
                    keyboardType="numeric"
                    style={[styles.input]}
                    defaultValue={endDayCurrentTime}
                    editable={false}
                  />
                </View>

                <View style={[styles.column]}>
                  <TextInput
                    editable={!startDay}
                    keyboardType="numeric"
                    style={[styles.input, {backgroundColor: '#D3FD7A'}]}
                    placeholderTextColor="#BFBFBF"
                    placeholder="Millometer Reading"
                    defaultValue={endDayMillometerReading}
                    onChangeText={text => setEndDayMillometerReading(text)}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: '#D3FD7A',
                        width: wp('82%'),
                        flex: 0.97,
                      },
                    ]}
                    placeholder="Remarks"
                    placeholderTextColor="#BFBFBF"
                    editable={!startDay}
                    defaultValue={endDayRemarks}
                    onChangeText={text => setEndDayRemarks(text)}
                  />
                </View>

                <View style={[styles.column, {justifyContent: 'center'}]}>
                  <TouchableOpacity
                    onPress={() => handleEndDaySubmit()}
                    style={styles.button1}
                    disabled={startDay}>
                    <Text style={{color: 'white'}}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {endDay && (
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 30,
                textAlign: 'center',
                color: theme1.MEDIUM_ORANGE_COLOR,
              }}>
              Your Day is Completed
            </Text>
          )}
          <ImagePickerModal
            isVisible={startDayvisible}
            onClose={() => setstartDayVisible(false)}
            onImageLibraryPress={pickImage}
            onCameraPress={pickFromCamera}
          />
          {/* <ImagePickerModal
              isVisible={endDayvisible}
              onClose={() => setEndDayVisible(false)}
              onImageLibraryPress={pickImage}
              onCameraPress={pickFromCamera}
            /> */}
        </ScrollView>
      ) : (
        <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
      )}
    </View>
  );
}

export default observer(Attendance);

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
    color: '#222',
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
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  heading: {
    flex: 1,
    backgroundColor: theme1.LIGHT_ORANGE_COLOR,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    color: 'black',
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
});
