//import liraries
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {observer} from 'mobx-react';
import moment from 'moment';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import ImageCropPicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import Feather from 'react-native-vector-icons/Feather';
import AuthStore from '../../Mobx/AuthStore';
import DatePicker from '../../components/DatePicker';
import {ImagePickerModal} from '../../components/ImagePickerModal';
import TextInputField from '../../components/TextInputField';
import theme1 from '../../components/styles/DarkTheme';
import {widthPercentageToDP as wp} from '../../responsiveLayout/ResponsiveLayout';

const {height, width} = Dimensions.get('window');
// create a component
const LocalTourClaim = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(AuthStore?.user);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [allLocalTour, setAllLocalTour] = useState([]);
  const [travelMode, setTravelMode] = useState([]);
  const [total, setTotal] = useState({});
  const [SingleRemark, setSingleRemark] = useState('');
  const [imageModal, setImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const clear = () => {
    setAllLocalTour([]);
    setTravelMode([]);
    setTotal({});
    setSingleRemark('');
    setImageModal(false);
    setSelectedImages([]);
  };

  const getLocalTour = async () => {
    try {
      setLoading(true);
      const tourRes = await axios.get(
        `${AuthStore?.host}/c_visit_entry/get_loc_tour?username=${userName}&period=${fromDate} to ${toDate}`,
      );
      // console.log(JSON.stringify(tourRes?.data))
      let Rate = 0;
      let ac = tourRes?.data?.accountSchema?.SalesDesignation?.DesignationGrade;
      if (ac?.two_wheeler > '0') {
        Rate = ac?.two_wheeler;
      }
      if (ac?.three_wheeler > '0') {
        Rate = ac?.three_wheeler;
      }
      if (ac?.four_wheeler > '0') {
        Rate = ac?.four_wheeler;
      }
      if (tourRes?.data?.local_tour) {
        let tourData = [];
        let total_distance = 0;
        tourRes?.data?.local_tour.map((item, index) => {
          tourData.push({
            date: item?.entrydate,
            start_time: item?.starttime,
            end_time: item?.endtime || '09:40PM',
            mode_of_travel: 'Road',
            distance: item?.kms,
            rate: Rate,
            amount: Number(item?.kms) * Number(Rate),
            remark: '',
          });
          total_distance += Number(item?.kms);
        });
        setAllLocalTour(tourData);
        setTravelMode(tourRes?.data?.mode_of_travel);
        setTotal({
          distance: String(total_distance),
          amount: Number(total_distance) * Number(Rate),
        });
      }
      setLoading(false);
    } catch (e) {}
  };

  const calculateTotal = () => {
    let total_distance = 0;
    allLocalTour?.map(item => {
      total_distance += Number(item?.distance);
    });
    setTotal({
      distance: String(total_distance),
      amount: Number(total_distance) * Number(allLocalTour[0]?.rate),
    });
  };

  const handleOnChange = (value, index, key) => {
    const list = [...allLocalTour];
    list[index][key] = value;
    if (key === 'distance') {
      list[index]['amount'] = Number(value) * Number(list[index]['rate']);
    }
    setAllLocalTour(list);
    setTimeout(() => {
      if (key === 'amount') {
        calculateTotal();
      }
    }, 300);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let formData = new FormData();

      if (selectedImages?.path) {
        const newImageUri =
          'file:///' + selectedImages?.path?.split('file:/')?.join('');

        let ext = newImageUri?.split('/')?.pop()?.split('.')[1];
        formData.append('tour_upload', {
          uri: selectedImages.path,
          type: `image/${ext}`, //imageDetails.type,
          name: newImageUri.split('/').pop(),
        });
      }

      if (selectedImages?.length > 0) {
        selectedImages.map(singleImage => {
          const newImageUri =
            'file:///' + singleImage?.path?.split('file:/')?.join('');

          let ext = newImageUri?.split('/')?.pop()?.split('.')[1];
          formData.append('tour_upload', {
            name: newImageUri?.split('/')?.pop(),
            type: `image/${ext}`, //imageDetails.type,
            uri: singleImage?.path,
          });
        });
      }

      formData.append('username', AuthStore?.user);
      formData.append('month', String(fromDate).split('/')[1]);
      formData.append('remarks', SingleRemark);
      formData.append('lckms', total?.distance);
      formData.append('lctotal', total?.amount);
      formData.append('compid', AuthStore?.companyId);
      formData.append('divid', AuthStore?.divisionId);
      formData.append('user', AuthStore?.user);
      formData.append('masterid', AuthStore?.masterId);
      formData.append('sales_or_group', JSON.stringify(allLocalTour));

      // console.log('Body ---> ', JSON.stringify(formData));

      const res = await axios({
        method: 'POST',
        url: `${AuthStore?.host}/loc_tour_claim/mobadd`,
        headers: {
          // 'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        processData: false,
        contentType: false,
        data: formData,
      });

      if (res.data) {
        setLoading(false);
        Toast.showWithGravity('Submitted', Toast.LONG, Toast.BOTTOM);
        clear();
        navigation.goBack();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemoveClick = index => {
    const list = [...allLocalTour];
    list.splice(index, 1);
    setAllLocalTour(list);
  };

  const handleAddClick = i => {
    let date = new Date().toDateString();
    setAllLocalTour([
      ...allLocalTour,
      {
        date: date,
        start_time: '',
        end_time: '09:40PM',
        mode_of_travel: 'Road',
        distance: 0,
        rate: allLocalTour[0]?.rate,
        amount: 0,
        remark: '',
      },
    ]);
  };

  const pickImage = async () => {
    try {
      ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageQuality: 0.5,
        multiple: true,
      })
        .then(image => {
          let all = [...selectedImages];
          image.map(a => {
            all.push(a);
          });
          setSelectedImages(all);
          setImageModal(false);
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
          let all = [...selectedImages];
          all.push(image);
          setSelectedImages(all);
          setImageModal(false);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log('IMAGE_PICKER_ERROR - ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={loading}
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
        label="User Name"
        placeHolder="enter name"
        value={userName}
        onChangeText={setUserName}
        style={styles.input_text}
        disable={true}
      />
      <View style={styles.range_row}>
        <DatePicker
          containerStyles={styles.datePicker_style}
          maxDate={Date.now()}
          textStyle={{color: theme1.SemiBlack}}
          date={fromDate}
          placeholder="From Date"
          placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
          setDate={value => {
            console.log(value);
            setFromDate(value);
          }}
        />
        <DatePicker
          containerStyles={styles.datePicker_style}
          maxDate={Date.now()}
          textStyle={{color: theme1.SemiBlack}}
          date={toDate}
          placeholder="To Date"
          placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
          setDate={setToDate}
        />
      </View>
      <TouchableOpacity
        style={styles.button1}
        onPress={() => {
          getLocalTour();
        }}>
        <Text style={{color: 'white'}}>Submit</Text>
      </TouchableOpacity>

      <View style={{marginTop: 20}} />

      <ScrollView style={{width: '100%'}}>
        {allLocalTour.length > 0 && (
          <View style={{flex: 1, alignItems: 'center'}}>
            {allLocalTour.length > 0 &&
              allLocalTour.map((tourItem, tourIndex) => {
                let startDate = moment(tourItem?.date).format('DD/MM/YYYY');
                return (
                  <View key={tourIndex} style={styles.card}>
                    <View
                      style={{
                        width: 70,
                        flexDirection: 'row',
                        alignSelf: 'flex-end',
                        justifyContent: 'flex-end',
                      }}>
                      {allLocalTour?.length - 1 === tourIndex && (
                        <TouchableOpacity
                          style={{marginHorizontal: 15}}
                          onPress={() => handleAddClick(tourIndex)}>
                          <Feather
                            name="plus-circle"
                            size={25}
                            color={theme1.LIGHT_ORANGE_COLOR}
                          />
                        </TouchableOpacity>
                      )}
                      {allLocalTour?.length !== 1 && (
                        <TouchableOpacity
                          onPress={() => handleRemoveClick(tourIndex)}>
                          <Feather
                            name="minus-circle"
                            size={25}
                            color={theme1.LIGHT_ORANGE_COLOR}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.column}>
                      <DatePicker
                        containerStyles={styles.datePicker_style}
                        maxDate={Date.now()}
                        textStyle={{color: theme1.SemiBlack}}
                        date={startDate}
                        placeholder="Date"
                        placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                        setDate={value => {
                          handleOnChange(value, tourIndex, 'date');
                        }}
                      />
                      <Dropdown
                        data={travelMode}
                        labelField="ModeName"
                        valueField="ModeName"
                        value={tourItem?.mode_of_travel}
                        placeholder="Select Travel Mode"
                        placeholderStyle={{
                          color: theme1.LIGHT_ORANGE_COLOR,
                          fontSize: 14,
                        }}
                        onChange={item => {
                          handleOnChange(
                            item?.ModeName,
                            tourIndex,
                            'mode_of_travel',
                          );
                        }}
                        style={styles.dropDown_style}
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
                      <DatePicker
                        containerStyles={styles.datePicker_style}
                        textStyle={{color: theme1.SemiBlack}}
                        date={tourItem?.start_time}
                        placeholder="Start Time"
                        placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                        setDate={value => {
                          handleOnChange(value, tourIndex, 'start_time');
                        }}
                        type="time"
                      />
                      <DatePicker
                        containerStyles={styles.datePicker_style}
                        textStyle={{color: theme1.SemiBlack}}
                        date={tourItem?.end_time}
                        placeholder="End Time"
                        placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                        setDate={value => {
                          handleOnChange(value, tourIndex, 'end_time');
                        }}
                        type="time"
                      />
                    </View>
                    <View style={styles.column}>
                      <TextInputField
                        label="Distance"
                        placeHolder="enter distance"
                        type={'numeric'}
                        value={String(tourItem?.distance)}
                        onChangeText={value => {
                          handleOnChange(value, tourIndex, 'distance');
                        }}
                        onEnd={() => {
                          calculateTotal();
                        }}
                        style={styles.card_input_text}
                      />
                      <TextInputField
                        label="Rate"
                        placeHolder="enter rate"
                        disable={true}
                        type={'numeric'}
                        value={tourItem?.rate}
                        onChangeText={() => {}}
                        style={styles.card_input_text}
                      />
                    </View>
                    <View style={styles.column}>
                      <TextInputField
                        label="Amount"
                        placeHolder="enter amount"
                        type={'numeric'}
                        value={String(tourItem?.amount)}
                        onChangeText={value => {
                          handleOnChange(value, tourIndex, 'amount');
                        }}
                        style={styles.card_input_text}
                        // disable={true}
                      />
                      <TextInputField
                        label="Remark"
                        placeHolder="enter remark"
                        // type={'numeric'}
                        value={tourItem?.remark}
                        onChangeText={value => {
                          handleOnChange(value, tourIndex, 'remark');
                        }}
                        style={styles.card_input_text}
                      />
                    </View>
                  </View>
                );
              })}
            {total?.distance && (
              <View style={styles.column}>
                <TextInputField
                  label="Total Distance"
                  placeHolder="enter distance"
                  type={'numeric'}
                  value={String(total?.distance)}
                  onChangeText={() => {}}
                  style={styles.card_input_text}
                  disable={true}
                />
                <TextInputField
                  label="Total Amount"
                  placeHolder="enter amount"
                  type={'numeric'}
                  value={String(total?.amount)}
                  onChangeText={() => {}}
                  style={styles.card_input_text}
                  disable={true}
                />
              </View>
            )}
            <TextInputField
              label="Remark"
              placeHolder="enter remark"
              // type={'numeric'}
              value={SingleRemark}
              onChangeText={value => {
                setSingleRemark(value);
              }}
              style={[styles.card_input_text, {width: '95%'}]}
            />
            {allLocalTour.length > 0 && (
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  marginTop: 5,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
                    height: 40,
                    width: 40,
                    borderWidth: 1,
                    margin: 5,
                    borderStyle: 'dashed',
                  }}
                  onPress={() => {
                    setImageModal(true);
                  }}>
                  <Text
                    style={{
                      fontSize: 25,
                      color: '#000',
                      textAlign: 'center',
                      textAlignVertical: 'center',
                    }}>
                    +
                  </Text>
                </TouchableOpacity>

                {selectedImages?.path && (
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      resizeMode: 'cover',
                      margin: 5,
                    }}
                    source={{uri: selectedImages?.path}}
                  />
                )}

                {selectedImages?.length > 0 &&
                  selectedImages?.map((singleImage, index) => {
                    return (
                      <Image
                        key={index + 'I'}
                        style={{
                          height: 40,
                          width: 40,
                          resizeMode: 'cover',
                          margin: 5,
                        }}
                        source={{uri: singleImage?.path}}
                      />
                    );
                  })}
              </View>
            )}
          </View>
        )}
        {allLocalTour.length > 0 && (
          <TouchableOpacity
            style={[styles.button1, {alignSelf: 'center'}]}
            onPress={() => {
              handleSave();
            }}>
            <Text style={{color: 'white'}}>Submit</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <ImagePickerModal
        isVisible={imageModal}
        onClose={() => setImageModal(false)}
        onImageLibraryPress={pickImage}
        onCameraPress={pickFromCamera}
      />
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
  card_input_text: {
    width: '48%',
    height: 40,
    marginTop: 15,
    borderRadius: 5,
  },
  range_row: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker_style: {
    width: '48%',
    height: 40,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: theme1.LIGHT_ORANGE_COLOR,
    marginTop: 15,
  },
  card: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginBottom: 5,
    borderColor: theme1.LIGHT_ORANGE_COLOR,
    borderWidth: 0.5,
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: wp('0.3%'),
    // marginVertical: hp('0.8%'),
    // alignItems: "center",
  },
  dropDown_style: {
    width: '48%',
    marginTop: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 5,
    borderColor: theme1.LIGHT_ORANGE_COLOR,
  },
});

//make this component available to the app
export default observer(LocalTourClaim);
