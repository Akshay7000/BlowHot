import AsyncStorage from '@react-native-async-storage/async-storage';
import {default as Axios, default as axios} from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import {observer} from 'mobx-react-lite';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import ImageCropPicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Modalize} from 'react-native-modalize';
import {Searchbar} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/Feather';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import DatePicker from '../../components/DatePicker';
import {ImagePickerModal} from '../../components/ImagePickerModal';
import SelectTwo from '../../components/SelectTwo';
import theme1 from '../../components/styles/DarkTheme';
import {host} from '../../Constants/Host';
import AuthStore from '../../Mobx/AuthStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../responsiveLayout/ResponsiveLayout';
import TextInputField from '../../components/TextInputField';
import {Dropdown} from 'react-native-element-dropdown';
import CallMapView from './CallMapView';
import Share from 'react-native-share';
import RBSheet from 'react-native-raw-bottom-sheet';

const height = Dimensions.get('window').height;

function CallSummary({navigation}) {
  const [loading, setLoading] = useState(true);

  const [tableData, setTableData] = useState();
  const [searchName, setSearchName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [loaded, setLoaded] = useState(false);
  const [productName, setProductName] = useState();
  const [modelName, setModelName] = useState();
  const [uniqueId, setUniqueId] = useState();

  // Assigned to Asc
  const [technician, setTechnician] = useState('');
  const [technicianContact, setTechnicianContact] = useState('');
  const [complaintDate, setComplaintDate] = useState();
  const [complaintRemarks, setComplaintRemarks] = useState('');
  const [fromDate, setFromDate] = useState(new Date(1598051730000));
  const [fromTime, setFromTime] = useState(false);
  const [toTime, setToTime] = useState(false);
  const [toDate, setToDate] = useState(new Date(1598051730000));

  //Reschedule
  const [firstTime, setFirstTime] = useState(new Date(1598051730000));
  const [firstTimeShow, setFirstTimeShow] = useState(false);
  const [secondTimeShow, setSecondTimeShow] = useState(false);
  const [secondTime, setSecondTime] = useState(new Date(1598051730000));
  const [reScheduleDate, setRescheduleDate] = useState();
  const [reScheduleRemark, setRescheduleRemark] = useState();

  // Add Alloted to Engineer
  const [SingleData, setSingleData] = useState({});
  const [charges, setCharges] = useState('');
  const [engineerDate, setEngineerDate] = useState(new Date(Date.now()));
  const [engineerRemarks, setEngineerRemarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [ta, setTa] = useState(0);
  const [status, setStatus] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [warrantyNumber, setWarrantyNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [warrantyType, setWarrantyType] = useState('');
  const [show, setShow] = useState(true);

  const [visit_group, setArray] = useState([
    {
      visit_qty: '',
      visit_spare_part: '',
      visit_rate: '',
      visit_status: '',
      visit_model: '',
      visit_product: '',
      visit_warranty: '',
      visit_consumption: '',
    },
  ]);

  const [productItems, setProductItems] = useState([]);
  const [brandItems, setBrandItems] = useState([]);
  const [modelItems, setModelItems] = useState([]);

  const [userLocation, setUserLocation] = useState();

  const [productId, setProductId] = useState('');
  const [brandId, setBrandId] = useState();
  const [modelId, setModelId] = useState('');

  const [imageModal, setImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [AutoSelectedImages, setAutoSelectedImages] = useState([]);
  const [happyCode, setHappyCode] = useState('');
  const [ReScheduleUser, setReScheduleUser] = useState();

  // Signature
  const RBref = useRef();
  const RBref2 = useRef();
  const MapRef = useRef();

  // const clearAll = () => {
  //   setBuyerId("");
  //   setSellerId("");
  //   setBrokerId("");
  //   setBuyer("");
  //   setSeller("");
  //   setBroker("");
  //   setCount(count + 1);
  // };

  const handleSingleIndexSelect = index => {
    // For single Tab Selection SegmentedControlTab
    setSelectedIndex(index);
    getDealerList(startDate, endDate, index);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setSelectedIndex(0);
      let todayDate = moment(new Date()).format('DD/MM/YYYY');
      let date = moment(await AsyncStorage.getItem('startingDate')).format(
        'DD/MM/YYYY',
      );

      setStartDate(date);
      setEndDate(todayDate);
      getDealerList(date, todayDate, 0);
      getProducts();
      getModels();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getProducts();
    getModels();
  }, []);

  const getDealerList = async (start, end, index) => {
    setLoading(true);
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;
    const administrator = AuthStore?.adminId;
    let arr = [
      'Assigned to Asc',
      'Alloted to engineer',
      'Re-Schedule',
      'Part-Pending',
      'Technical-Advice',
    ];
    var status = arr[index];

    const body = {
      masterid: masterid,
      compid: compid,
      divid: divid,
      call_status: status,
      start_date: start,
      end_date: end,
      user: user,
      administrator: administrator,
    };
    console.log('API  -> ', `${host}/call_summary/mobcall_summary`);
    axios
      .post(`${host}/call_summary/mobcall_summary`, body)
      .then(function (response) {
        // console.log('res -> ', JSON.stringify(response.data?.s_call));
        setTableData(response?.data?.s_call);
        setFilteredData(response?.data?.s_call);
        setLoading(false);
      })
      .catch(function (error) {
        console.log('erro', error);
        setLoading(false);
      });
  };

  const getProducts = async () => {
    axios
      .post(`${host}/call_summary/mobgetproduct`, {
        masterid: AuthStore?.masterId,
      })
      .then(function (response) {
        let products = [...productItems];

        response.data.product.map((dat, index) => {
          products[index] = {...dat, id: dat._id, name: dat.Fg_Des};
        });
        setProductItems(products);
      })
      .catch(function (error) {
        console.log(error, 'error');
      });
  };

  const getModels = async () => {
    axios
      .post(`${host}/call_summary/mobgetmodel`, {
        masterid: AuthStore?.masterId,
      })
      .then(function (response) {
        let models = [...modelItems];

        response.data.model.map((dat, index) => {
          models[index] = {...dat, id: dat._id, name: dat.Description};
        });
        setModelItems(models);
      })
      .catch(function (error) {
        console.log(error, 'error');
      });
  };

  const getParticularData = id => {
    axios
      .get(`${host}/s_call/mobs_call_update/${id}`)
      .then(function (response) {
        const data = response?.data?.s_call;
        // console.log(
        //   'Response mobs_call_update --> ',
        //   JSON.stringify(response?.data?.s_call),
        // );
        setSingleData(data);
        setCharges(data?.visit_charges);
        setTa(data?.ta_km);
        setEngineerRemarks(data?.visit_remark);
        setFeedback(data?.visit_feedback);
        setInvoiceNumber(data?.invoice_no?.toString());
        setWarrantyType(data?.s_stus);
        setStatus(data?.call_pending);
        setEngineerDate(moment(new Date(data?.pur_date)).format('DD/MM/YYYY'));
        setArray(
          data?.visit_group.length > 0
            ? data?.visit_group
            : [
                {
                  visit_qty: '',
                  visit_spare_part: '',
                  visit_rate: '',
                  visit_status: '',
                  visit_model: '',
                  visit_product: '',
                  visit_warranty: '',
                  visit_consumption: '',
                },
              ],
        );
        setProductId(data?.s_prod?._id || '');
        setModelId(data?.s_mdl?._id || '');
        setProductName(data?.s_prod?.Fg_Des || '');
        setUniqueId(data?.unique_id || '');
        setModelName(data?.s_mdl.Description || '');
        setAutoSelectedImages(data?.filepath || '');
        setSelectedImages([]);

        // console.log('Visit Group --> ', JSON.stringify(data?.visit_group));

        let brand = [...brandItems];
        response?.data?.rawMat_mast?.map((dat, index) => {
          brand[index] = {
            ...brand[index],
            id: dat?.raw_matrl_nm?._id,
            name: dat?.raw_matrl_nm?.Rm_Des,
          };
        });
        setBrandItems(brand);
        setLoading(false);
        setTimeout(() => {
          RBref.current.open();
        }, 500);
      })
      .catch(function (error) {
        console.log(error, 'error');
      });
  };

  const filter = text => {
    const array = [...tableData];
    const newArray = array.filter(
      table =>
        table?.s_cus?.ACName?.toLowerCase()?.includes(text?.toLowerCase()) ||
        table?.s_cus?.Address1?.toLowerCase()?.includes(text?.toLowerCase()) ||
        table?.s_cus?.CityName?.CityName?.toLowerCase()?.includes(
          text?.toLowerCase(),
        ) ||
        String(table?.s_cus?.MobileNo)?.includes(text),
    );
    setFilteredData(newArray);
  };

  const handleFromChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setFromDate(currentDate);
    setFromTime(false);
  };

  const handleFirstTime = (event, selectedDate) => {
    const currentDate = selectedDate || firstTime;
    setFirstTime(currentDate);
    setFirstTimeShow(false);
  };

  const handleSecondTime = (event, selectedDate) => {
    const currentDate = selectedDate || secondTime;
    setSecondTime(currentDate);
    setSecondTimeShow(false);
  };

  const handleRescheduleChanges = () => {
    setLoading(true);
    Axios({
      method: 'POST',
      url: `${host}/s_call/mobreschedule_add?reschedule_date=${reScheduleDate}&first_time=${firstTime}&second_time=${secondTime}&rescheduleremark=${reScheduleRemark}&vhpxappointment=${SingleData?._id}`,
    })
      .then(respone => {
        Toast.showWithGravity(
          'Appointment Rescheduled.',
          Toast.LONG,
          Toast.BOTTOM,
        );

        setLoading(false);
        RBref2.current.close();
      })
      .catch(error => {
        Toast.showWithGravity(
          'Reschedule Appointment Failed.',
          Toast.LONG,
          Toast.BOTTOM,
        );
        setLoading(false);
      });
  };

  //To Time
  const handleToChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setToDate(currentDate);
    setToTime(false);
  };

  const clearAsc = () => {
    const todayDate = moment(new Date()).format('DD/MM/YYYY');
    setFromDate(new Date(1598051730000));
    setToDate(new Date(1598051730000));
    setToTime(false);
    setFromTime(false);
    setComplaintDate();
    setComplaintRemarks('');
    setTechnician('');
    setTechnicianContact('');
  };

  const clearReSch = () => {
    setFirstTime(new Date(1598051730000));
    setSecondTime(new Date(1598051730000));
    setReScheduleUser({});
    setRescheduleDate();
    setRescheduleRemark('');
  };

  const handleAppointmentSubmit = async () => {
    setLoading(true);
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;

    const body = {
      first_time: `${fromDate.getHours()}:${fromDate.getMinutes()}`,
      end_time: `${toDate.getHours()}:${toDate.getMinutes()}`,
      appointment_technician: technician,
      technician_mobno: technicianContact,
      appointment_date: complaintDate,
      appointment_remark: complaintRemarks,
      vhpxappointment: SingleData?._id,
      user: user,
      compid: compid,
      divid: divid,
      masterid: masterid,
    };

    Axios({
      method: 'POST',
      url: `${host}/s_call/mobappointment_add`,
      data: body,
    })
      .then(respone => {
        Toast.showWithGravity('Data Submitted.', Toast.LONG, Toast.BOTTOM);
        clearAsc();
        setLoading(false);
        RBref.current.close();
      })
      .catch(error => {
        Toast.showWithGravity('Data Submit Failed.', Toast.LONG, Toast.BOTTOM);
        setLoading(false);
      });
  };

  const handleProductClick = i => {
    setArray([
      ...visit_group,
      {
        visit_qty: '',
        visit_spare_part: '',
        visit_rate: '',
        visit_status: '',
        visit_model: '',
        visit_product: '',
      },
    ]);
  };

  const handleRemoveClick = index => {
    const list = [...visit_group];
    list.splice(index, 1);
    setArray(list);
  };

  const handleProductDetails = (value, index, name) => {
    const list = [...visit_group];
    list[index][name] = value;
    setArray(list);
  };

  const handleEngineerSubmit = async () => {
    if (
      status === 'Resolved' &&
      SingleData?._id?.substring(SingleData?._id.length - 6).toUpperCase() !==
        happyCode
    ) {
      return Toast.showWithGravity(
        'Invalid Happy Code',
        Toast.LONG,
        Toast.BOTTOM,
      );
    }
    setLoading(true);
    const data = new FormData();
    const user = AuthStore?.user;
    const masterid = AuthStore?.masterId;
    const compid = AuthStore?.companyId;
    const divid = AuthStore?.divisionId;

    if (selectedImages?.path) {
      const newImageUri =
        'file:///' + selectedImages.path.split('file:/').join('');

      let ext = newImageUri.split('/').pop().split('.')[1];
      data.append('files', {
        uri: selectedImages.path,
        type: `image/${ext}`, //imageDetails.type,
        name: newImageUri.split('/').pop(),
      });
    }
    if (selectedImages?.length > 0) {
      selectedImages.map(singleImage => {
        const newImageUri =
          'file:///' + singleImage?.path?.split('file:/')?.join('');

        let ext = newImageUri.split('/').pop().split('.')[1];
        data.append('files', {
          name: newImageUri.split('/').pop(),
          type: `image/${ext}`, //imageDetails.type,
          uri: singleImage.path,
        });
      });
    }

    let array = visit_group;
    data.append('visit_date', engineerDate);
    data.append('warranty_type', warrantyType);
    data.append('invoice_no', invoiceNumber);
    data.append('serial_no', serialNumber);
    data.append('warranty_card_no', warrantyNumber);
    data.append('s_prod', productId);
    data.append('s_mdl', modelId);
    data.append('first_visit_status', status);
    data.append('visit_group', JSON.stringify(array));
    data.append('visit_charges', charges);
    data.append('visit_remark', engineerRemarks);
    data.append('ta_km', ta);
    data.append('visit_feedback', feedback);
    data.append('visit_signature', '');
    data.append('vhpxvisit', SingleData?._id);
    data.append('vunique_id', uniqueId);
    data.append('ac_phmob', SingleData?.s_cus?.MobileNo);
    data.append('user', user);
    data.append('compid', compid);
    data.append('divid', divid);
    data.append('masterid', masterid);
    data.append('previousfilepath', AutoSelectedImages);

    await Axios({
      method: 'POST',
      url: `${host}/s_call/mobvisit_add`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      processData: false,
      contentType: false,
      data: data,
    })
      .then(response => {
        Toast.showWithGravity('Data Submitted.', Toast.LONG, Toast.BOTTOM);
        const todayDate = moment(new Date()).format('DD/MM/YYYY');
        RBref.current.close();
        // nav.reset({index: 0, routes: [{name: 'Home'}]});
        setLoading(false);
      })
      .catch(e => {
        console.log('API error --> ', e);
        setLoading(false);
      });
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
          setSelectedImages(image);
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
          setSelectedImages(image);
          setImageModal(false);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log('IMAGE_PICKER_ERROR - ', error);
    }
  };

  const resendHappyCode = async () => {
    try {
      Axios.post(`${host}/s_call/re_sms`, {
        mob_no: SingleData?.s_cus?.MobileNo,
        unique_id: uniqueId,
        mongid: SingleData?._id,
      }).then(res => {
        Toast.showWithGravity(
          'Code Sent Successfully',
          Toast.LONG,
          Toast.BOTTOM,
        );
      });
    } catch (e) {
      console.log('Error on resend Happy Code --> ', e);
    }
  };

  const ShareData = async data => {
    try {
      Linking.openURL(
        `https://api.whatsapp.com/send?phone=91${
          data?.s_cus?.MobileNo
        }&text=Name:- ${data?.s_cus?.ACName}\n\nAddress:- ${
          data?.s_cus?.Address1
        }\n\nProduct:- ${data?.s_prod?.Fg_Des}\n\nProblem:- ${
          data?.typ_call?.CallType
        }\n\nModel:- ${data?.s_mdl?.Description}\n\nStatus:- ${String(
          data?.s_stus,
        )?.toUpperCase()}`,
      );
    } catch (e) {}
  };

  return (
    <SafeAreaView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginVertical: 5}}>
        {[
          'Assigned to Asc',
          'Visit Schedule',
          'Re-Schedule',
          'Part Pending',
          'Tech Advice',
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSingleIndexSelect(index)}>
            <View
              style={
                selectedIndex === index
                  ? styles.activeTabStyle
                  : styles.tabStyle
              }>
              <Text
                style={
                  selectedIndex === index
                    ? {color: theme1.White, padding: 10}
                    : {color: theme1.LightBlack, padding: 10}
                }>
                {item}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
          <ActivityIndicator size="large" color="skyblue" />
        </View>
      </Modal>

      {filteredData && (
        <React.Fragment>
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

          <View style={{height: height - 205}}>
            <FlatList
              data={filteredData}
              initialNumToRender={10}
              keyExtractor={item => item.unique_id}
              renderItem={({item, index}) => {
                return (
                  <View
                    key={item?.unique_id}
                    style={{
                      width: '90%',
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
                        {item?.unique_id}.
                      </Text>
                      <Text style={{fontSize: 12, color: '#FFF'}}>
                        {moment(new Date(item?.so_date).toDateString()).format(
                          'DD-MM-YYYY',
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
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
                        }}>{`${item.s_cus?.ACName}, ${item.s_cus?.Address1}, ${item?.s_cus?.CityName?.CityName}`}</Text>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            item?.s_cus?.MobileNo &&
                              Linking.openURL(
                                `tel:${item?.s_cus?.MobileNo}`,
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
                        {!!item.s_cus?.ac_altno && (
                          <TouchableOpacity
                            onPress={() => {
                              item?.s_cus?.ac_altno &&
                                Linking.openURL(
                                  `tel:${item?.s_cus?.ac_altno}`,
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
                              <Icon
                                name="phone"
                                color={theme1.White}
                                size={15}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: theme1.GreyWhite,
                        width: '90%',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#FFF',
                        }}>
                        {`Contact: - ${item.s_cus?.MobileNo}`}
                        {!!item.s_cus?.ac_altno && `, ${item.s_cus?.ac_altno}`}
                      </Text>
                    </View>
                    <View
                      key={index}
                      style={{width: '90%', alignSelf: 'center'}}>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Product: - </Text>
                        <Text
                          style={[styles.SgValue, {width: '80%'}]}
                          numberOfLines={1}>
                          {item?.s_prod?.Fg_Des}
                        </Text>
                      </View>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Problem: - </Text>
                        <Text
                          style={[styles.SgValue, {width: '80%'}]}
                          numberOfLines={1}>
                          {item?.typ_call?.CallType}
                        </Text>
                      </View>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Model: - </Text>
                        <Text
                          style={[styles.SgValue, {width: '80%'}]}
                          numberOfLines={1}>
                          {item?.s_mdl?.Description}
                        </Text>
                      </View>
                      <View style={styles.SgView}>
                        <Text style={styles.SgLabel}>Status: - </Text>
                        <Text
                          style={[styles.SgValue, {width: '80%'}]}
                          numberOfLines={1}>
                          {item?.s_stus}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '90%',
                        alignSelf: 'center',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginVertical: 10,
                      }}>
                      <TouchableOpacity
                        style={styles.ListButton}
                        onPress={() => {
                          if (item?._id) {
                            setLoading(true);
                            getParticularData(item?._id);
                          }
                        }}>
                        <View>
                          <Text style={styles.ListButtonText}>Submit</Text>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          width: 100,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setUserLocation({
                              latitude: Number(item?.latitude),
                              longitude: Number(item?.longitude),
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            });
                            MapRef.current.open();
                          }}>
                          <Entypo
                            name="location"
                            size={25}
                            color={theme1.DARK_BLUE_COLOR}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            ShareData(item);
                          }}>
                          <FIcon name="whatsapp" size={25} color={'green'} />
                        </TouchableOpacity>
                      </View>
                      {selectedIndex !== 0 && (
                        <TouchableOpacity
                          style={styles.ListButton}
                          onPress={() => {
                            setReScheduleUser(item);
                            RBref2.current.open();
                          }}>
                          <View>
                            <Text style={styles.ListButtonText}>
                              Re-Schedule
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              }}
            />
          </View>

          {selectedIndex === 0 && (
            <Modalize
              ref={RBref}
              useNativeDriver={true}
              withHandle={false}
              modalHeight={height - 25}>
              <KeyboardAwareScrollView
                automaticallyAdjustKeyboardInsets
                contentContainerStyle={{
                  height: height,
                }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                scrollEnabled={true}
                keyboardShouldPersistTaps={'always'}>
                <View
                  style={{
                    padding: 8,
                    textAlign: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 0.5,
                    flexDirection: 'row',
                    // backgroundColor: theme1.LIGHT_ORANGE_COLOR,
                    justifyContent: 'space-between',
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                  }}>
                  <Text
                    style={{fontSize: 17, fontWeight: 'bold', color: '#222'}}>
                    Add Assigned to Asc{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      clearAsc();
                      RBref.current.close();
                    }}
                    style={{marginRight: 20}}>
                    <FIcon name="close" size={20} color="#222" />
                  </TouchableOpacity>
                </View>
                {fromTime && (
                  <DateTimePicker
                    value={fromDate}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleFromChange}
                  />
                )}

                {toTime && (
                  <DateTimePicker
                    value={toDate}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleToChange}
                  />
                )}

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                  <View>
                    <Text
                      style={{
                        marginTop: 22,
                        fontSize: wp('3%'),
                        color: theme1.LIGHT_ORANGE_COLOR,
                      }}>
                      Time ({fromDate?.getHours()} Hrs:
                      {fromDate?.getMinutes()} Min)
                    </Text>
                    <TouchableOpacity onPress={() => setFromTime(true)}>
                      <Text
                        style={{
                          borderWidth: 1,
                          borderColor: theme1.LIGHT_ORANGE_COLOR,
                          borderRadius: 20,
                          padding: 10,
                          marginVertical: 10,
                          color: theme1.LIGHT_ORANGE_COLOR,
                        }}>
                        Select From Time
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      width: wp('10%'),
                      textAlign: 'center',
                      marginTop: 22,
                      fontSize: wp('3%'),
                      color: theme1.LIGHT_ORANGE_COLOR,
                    }}>
                    To
                  </Text>

                  <View>
                    <Text
                      style={{
                        // width: wp('50%'),
                        // flex: 0.3,
                        marginTop: 22,
                        fontSize: wp('3%'),
                        color: theme1.LIGHT_ORANGE_COLOR,
                      }}>
                      Time ({toDate?.getHours()} Hrs:{toDate?.getMinutes()} Min)
                    </Text>
                    <TouchableOpacity onPress={() => setToTime(true)}>
                      <Text
                        style={{
                          borderWidth: 1,
                          borderColor: theme1.LIGHT_ORANGE_COLOR,
                          borderRadius: 20,
                          padding: 10,
                          marginVertical: 10,
                          color: theme1.LIGHT_ORANGE_COLOR,
                        }}>
                        Select To Time
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <DatePicker
                  conatinerStyles={{
                    width: wp('90%'),
                    alignSelf: 'center',
                    height: 40,
                    justifyContent: 'center',
                    borderRadius: 5,
                    borderColor: theme1.LIGHT_ORANGE_COLOR,
                    paddingLeft: 22,
                  }}
                  date={complaintDate}
                  placeholder="Date"
                  placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                  setDate={setComplaintDate}
                />

                <TextInputField
                  label="Technician"
                  placeHolder="enter technician"
                  value={technician}
                  onChangeText={setTechnician}
                  // leftIcon={<INSTITUTE_ICON />}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    height: 50,
                    marginTop: 15,
                  }}
                />

                <TextInputField
                  label="Technician contact"
                  placeHolder="eg: - 9876543210"
                  value={technicianContact}
                  onChangeText={setTechnicianContact}
                  type={'decimal-pad'}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    height: 50,
                    marginTop: 15,
                  }}
                />

                <TextInputField
                  label="Remark"
                  placeHolder="enter remark"
                  value={complaintRemarks}
                  onChangeText={setComplaintRemarks}
                  // type={'decimal-pad'}
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    height: 50,
                    marginTop: 15,
                  }}
                />

                {/* <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      width: wp('10%'),
                      flex: 0.3,
                      marginTop: 15,
                      fontSize: wp('3%'),
                      color: '#222',
                    }}>
                    Technician
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: '#D3FD7A',
                        width: wp('82%'),
                        flex: 0.9,
                        marginRight: wp('6.5%'),
                        color: '#222',
                      },
                    ]}
                    placeholder="Technician"
                    placeholderTextColor="#bbb"
                    defaultValue={technician}
                    onChangeText={text => setTechnician(text)}
                  />
                </View> */}
                {/* <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      width: wp('10%'),
                      flex: 0.3,
                      marginTop: 15,
                      fontSize: wp('3%'),
                      color: '#222',
                    }}>
                    Technician Mob No.
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: '#D3FD7A',
                        width: wp('82%'),
                        flex: 0.9,
                        marginRight: wp('6.5%'),
                        color: '#222',
                      },
                    ]}
                    placeholder="Technician Mob No."
                    keyboardType="decimal-pad"
                    placeholderTextColor="#bbb"
                    defaultValue={technicianContact}
                    onChangeText={text => setTechnicianContact(text)}
                  />
                </View> */}
                {/* <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      width: wp('10%'),
                      flex: 0.45,
                      marginTop: 22,
                      fontSize: wp('3%'),
                      color: '#222',
                    }}>
                    Date:
                  </Text>
                  <DatePicker
                    conatinerStyles={{
                      // width: wp('42%'),
                      height: 40,
                      justifyContent: 'center',
                      borderRadius: 5,
                      marginLeft: 8,
                      marginRight: 17,
                      borderColor: theme1.LIGHT_ORANGE_COLOR,
                    }}
                    date={complaintDate}
                    placeholder="Date"
                    setDate={setComplaintDate}
                  />
                </View> */}
                {/* <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      width: wp('10%'),
                      flex: 0.3,
                      marginTop: 15,
                      fontSize: wp('3%'),
                      color: '#222',
                    }}>
                    Remark{' '}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: '#D3FD7A',
                        width: wp('82%'),
                        flex: 0.9,
                        marginRight: wp('6.5%'),
                        color: '#222',
                      },
                    ]}
                    placeholder="Remarks"
                    placeholderTextColor="#bbb"
                    defaultValue={complaintRemarks}
                    onChangeText={text => setComplaintRemarks(text)}
                  />
                </View> */}

                <View
                  style={[
                    styles.column,
                    {justifyContent: 'center', marginTop: hp('2%')},
                  ]}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={() => handleAppointmentSubmit()}>
                    <Text style={{color: 'white'}}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            </Modalize>
          )}

          {selectedIndex !== 0 && (
            <Modalize
              ref={RBref}
              useNativeDriver={true}
              withHandle={false}
              modalHeight={height - 25}>
              <KeyboardAwareScrollView
                automaticallyAdjustKeyboardInsets
                contentContainerStyle={{
                  flex: 1,
                  borderTopRightRadius: 8,
                  borderTopLeftRadius: 8,
                }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                scrollEnabled={true}
                keyboardShouldPersistTaps={'always'}>
                <View
                  style={{
                    padding: 8,
                    textAlign: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 0.5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // backgroundColor: theme1.LIGHT_ORANGE_COLOR,
                    borderTopRightRadius: 8,
                    borderTopLeftRadius: 8,
                  }}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                    {selectedIndex == 1
                      ? 'Add Alloted to Engineer'
                      : 'Part-Pending'}{' '}
                    -{uniqueId}{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      RBref.current.close();
                    }}
                    style={{
                      marginRight: 20,
                      height: 30,
                      width: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FIcon name="close" size={20} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <Dropdown
                    data={[
                      {label: 'In-Warranty', value: 'in-warranty'},
                      {label: 'Out-Warranty', value: 'out-warranty'},
                      {label: 'New', value: 'new'},
                    ]}
                    labelField="label"
                    valueField="value"
                    value={warrantyType}
                    placeholder="Select Warranty"
                    placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                    onChange={item => setWarrantyType(item?.value)}
                    style={{
                      width: '48%',
                      alignSelf: 'center',
                      borderWidth: 1,
                      borderRadius: 5,
                      paddingLeft: 5,
                      borderColor: theme1.LIGHT_ORANGE_COLOR,
                    }}
                    activeColor={theme1.LIGHT_ORANGE_COLOR}
                    selectedTextStyle={{color: theme1.SemiBlack, fontSize: 12}}
                    itemTextStyle={{fontSize: 12}}
                    containerStyle={{borderRadius: 8}}
                    itemContainerStyle={{borderRadius: 8}}
                    iconColor={theme1.LIGHT_ORANGE_COLOR}
                  />
                  <Dropdown
                    data={[
                      {label: 'Resolved', value: 'Resolved'},
                      {label: 'Part-Pending', value: 'Part-Pending'},
                      {
                        label: 'Technical-Advice',
                        value: 'Technical-Advice',
                      },
                      {label: 'Cancel', value: 'Cancel'},
                      {label: 'Visit Schedule', value: 'Visit Schedule'},
                      {label: 'Re Schedule', value: 'Re Schedule'},
                    ]}
                    labelField="label"
                    valueField="value"
                    value={status}
                    placeholder="Select Status"
                    placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                    onChange={item => setStatus(item?.value)}
                    style={{
                      width: '48%',
                      alignSelf: 'center',
                      borderWidth: 1,
                      borderRadius: 5,
                      paddingLeft: 5,
                      borderColor: theme1.LIGHT_ORANGE_COLOR,
                    }}
                    activeColor={theme1.LIGHT_ORANGE_COLOR}
                    selectedTextStyle={{color: theme1.SemiBlack, fontSize: 12}}
                    itemTextStyle={{fontSize: 12}}
                    containerStyle={{borderRadius: 8}}
                    itemContainerStyle={{borderRadius: 8}}
                    iconColor={theme1.LIGHT_ORANGE_COLOR}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TextInputField
                    label="Invoice No."
                    placeHolder="enter Invoice No."
                    value={invoiceNumber || ''}
                    onChangeText={setInvoiceNumber}
                    style={{
                      width: '48%',
                      height: 40,
                      marginTop: 15,
                      borderRadius: 5,
                    }}
                  />
                  <DatePicker
                    conatinerStyles={{
                      width: '48%',
                      height: 40,
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderColor: theme1.LIGHT_ORANGE_COLOR,
                      marginTop: 15,
                    }}
                    textStyle={{color: theme1.SemiBlack}}
                    date={engineerDate}
                    placeholder="Date"
                    placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                    setDate={setEngineerDate}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: '90%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TextInputField
                    label="Serial No."
                    placeHolder="enter Serial No."
                    value={serialNumber}
                    onChangeText={setSerialNumber}
                    style={{
                      width: '48%',
                      height: 40,
                      marginTop: 15,
                      borderRadius: 5,
                    }}
                  />
                  <TextInputField
                    label="Warranty card no."
                    placeHolder="enter warranty card no."
                    value={warrantyNumber}
                    onChangeText={setWarrantyNumber}
                    style={{
                      width: '48%',
                      height: 40,
                      marginTop: 15,
                      borderRadius: 5,
                    }}
                  />
                </View>

                <Dropdown
                  data={modelItems}
                  labelField="name"
                  valueField="id"
                  value={modelId || ''}
                  placeholder="Select model"
                  placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                  onChange={item => {
                    setModelId(item.id);
                  }}
                  search={true}
                  searchPlaceholder="Search"
                  style={{
                    width: '90%',
                    marginTop: 10,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingLeft: 5,
                    borderColor: theme1.LIGHT_ORANGE_COLOR,
                  }}
                  activeColor={theme1.LIGHT_ORANGE_COLOR}
                  selectedTextStyle={{color: theme1.SemiBlack, fontSize: 12}}
                  itemTextStyle={{fontSize: 12}}
                  containerStyle={{borderRadius: 8}}
                  itemContainerStyle={{borderRadius: 8}}
                  iconColor={theme1.LIGHT_ORANGE_COLOR}
                />

                <Dropdown
                  data={productItems}
                  labelField="name"
                  valueField="id"
                  value={productId || SingleData?.s_prod?._id || ''}
                  placeholder="Select model"
                  placeholderStyle={{color: theme1.LIGHT_ORANGE_COLOR}}
                  onChange={item => {
                    setProductId(item.id);
                  }}
                  search={true}
                  searchPlaceholder="Search"
                  style={{
                    width: '90%',
                    marginTop: 10,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingLeft: 5,
                    borderColor: theme1.LIGHT_ORANGE_COLOR,
                  }}
                  activeColor={theme1.LIGHT_ORANGE_COLOR}
                  selectedTextStyle={{color: theme1.SemiBlack, fontSize: 12}}
                  itemTextStyle={{fontSize: 12}}
                  containerStyle={{borderRadius: 8}}
                  itemContainerStyle={{borderRadius: 8}}
                  iconColor={theme1.LIGHT_ORANGE_COLOR}
                />

                {status === 'Resolved' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '90%',
                      alignSelf: 'center',
                    }}>
                    <TextInputField
                      label="Happy Code"
                      placeHolder="enter happy code"
                      value={happyCode}
                      onChangeText={text => {
                        if (text.length <= 6) {
                          setHappyCode(text.toUpperCase());
                        }
                      }}
                      style={[
                        {
                          width: '60%',
                          height: 40,
                          marginTop: 15,
                        },
                      ]}
                    />
                    <View style={{marginTop: 15}}>
                      <FIcon
                        size={25}
                        name={
                          happyCode.length === 6 &&
                          SingleData?._id
                            ?.substring(SingleData?._id.length - 6)
                            .toUpperCase() === happyCode
                            ? 'check'
                            : 'close'
                        }
                        color={
                          happyCode.length === 6 &&
                          SingleData?._id
                            ?.substring(SingleData?._id.length - 6)
                            .toUpperCase() === happyCode
                            ? 'green'
                            : theme1.DARK_ORANGE_COLOR
                        }
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        resendHappyCode();
                      }}
                      style={{
                        height: 30,
                        backgroundColor: theme1.DARK_ORANGE_COLOR,
                        justifyContent: 'center',
                        marginTop: 15,
                        paddingHorizontal: 10,
                        borderRadius: 8,
                      }}>
                      <View>
                        <Text style={{color: theme1.White}}>Resend Code</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

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

                  {AutoSelectedImages?.length > 0 &&
                    AutoSelectedImages?.map((fillImage, index) => {
                      return (
                        <Image
                          key={index + 'AI'}
                          style={{
                            height: 40,
                            width: 40,
                            resizeMode: 'cover',
                            margin: 5,
                          }}
                          source={{uri: `${host}/${fillImage}`}}
                        />
                      );
                    })}

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

                <View style={{marginTop: 0}}>
                  {visit_group?.map((x, i) => {
                    return (
                      <View key={i} style={styles.card}>
                        <View
                          style={{
                            width: 70,
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            justifyContent: 'flex-end',
                          }}>
                          {visit_group?.length - 1 === i && (
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
                          {visit_group?.length !== 1 && (
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
                            data={brandItems}
                            labelField="name"
                            valueField="id"
                            value={x?.visit_spare_part || ''}
                            placeholder="Spare Part"
                            placeholderStyle={{
                              color: theme1.LIGHT_ORANGE_COLOR,
                            }}
                            onChange={item => {
                              handleProductDetails(
                                item.id,
                                i,
                                'visit_spare_part',
                              );
                            }}
                            search={true}
                            searchPlaceholder="Search"
                            style={{
                              width: '48%',
                              marginTop: 10,
                              alignSelf: 'center',
                              borderWidth: 1,
                              borderRadius: 5,
                              paddingLeft: 5,
                              borderColor: theme1.LIGHT_ORANGE_COLOR,
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
                            data={[
                              {label: 'Installed', value: 'Installed'},
                              {label: 'Pending', value: 'Pending'},
                              {label: 'Shipped', value: 'Shipped'},
                              {label: 'Delivered', value: 'Delivered'},
                              {label: 'In-Process', value: 'In-Process'},
                            ]}
                            labelField="label"
                            valueField="value"
                            value={x?.visit_status || ''}
                            placeholder="Select Status"
                            placeholderStyle={{
                              color: theme1.LIGHT_ORANGE_COLOR,
                            }}
                            onChange={item =>
                              handleProductDetails(
                                item.value,
                                i,
                                'visit_status',
                              )
                            }
                            style={{
                              width: '48%',
                              marginTop: 10,
                              alignSelf: 'center',
                              borderWidth: 1,
                              borderRadius: 5,
                              paddingLeft: 5,
                              borderColor: theme1.LIGHT_ORANGE_COLOR,
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
                            data={[
                              {label: 'Own', value: 'Own'},
                              {label: 'Company', value: 'Company'},
                            ]}
                            labelField="label"
                            valueField="value"
                            value={x?.visit_consumption || ''}
                            placeholder="Select Consumption"
                            placeholderStyle={{
                              color: theme1.LIGHT_ORANGE_COLOR,
                              fontSize: 14,
                            }}
                            onChange={item =>
                              handleProductDetails(
                                item.value,
                                i,
                                'visit_consumption',
                              )
                            }
                            style={{
                              width: '48%',
                              marginTop: 10,
                              alignSelf: 'center',
                              borderWidth: 1,
                              borderRadius: 5,
                              paddingLeft: 5,
                              borderColor: theme1.LIGHT_ORANGE_COLOR,
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
                            data={[
                              {label: 'In-Warranty', value: 'In-Warranty'},
                              {label: 'Out-Warranty', value: 'Out-Warranty'},
                            ]}
                            labelField="label"
                            valueField="value"
                            value={x?.visit_warranty || ''}
                            placeholder="Select Warranty"
                            placeholderStyle={{
                              color: theme1.LIGHT_ORANGE_COLOR,
                            }}
                            onChange={item =>
                              handleProductDetails(
                                item.value,
                                i,
                                'visit_warranty',
                              )
                            }
                            style={{
                              width: '48%',
                              marginTop: 10,
                              alignSelf: 'center',
                              borderWidth: 1,
                              borderRadius: 5,
                              paddingLeft: 5,
                              borderColor: theme1.LIGHT_ORANGE_COLOR,
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
                          <TextInputField
                            label="Quantity"
                            placeHolder="enter quantity"
                            type={'numeric'}
                            value={String(x?.visit_qty) || ''}
                            onChangeText={value =>
                              handleProductDetails(value, i, 'visit_qty')
                            }
                            style={{
                              width: '48%',
                              height: 40,
                              marginTop: 15,
                              borderRadius: 5,
                            }}
                          />
                          <TextInputField
                            label="Rate"
                            placeHolder="enter rate"
                            type={'numeric'}
                            value={String(x?.visit_rate) || ''}
                            onChangeText={value =>
                              handleProductDetails(value, i, 'visit_rate')
                            }
                            style={{
                              width: '48%',
                              height: 40,
                              marginTop: 15,
                              borderRadius: 5,
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingLeft: 20,
                  }}>
                  {show ? (
                    <TouchableOpacity
                      onPress={() => setShow(!show)}
                      style={{display: 'flex', flexDirection: 'row'}}>
                      <Text style={{color: 'grey', fontSize: 13}}>
                        Show More
                      </Text>
                      <FIcon
                        name="caret-down"
                        size={wp('4%')}
                        color="black"
                        style={{top: -2, left: 4}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShow(!show)}
                      style={{display: 'flex', flexDirection: 'row'}}>
                      <Text style={{color: 'grey', fontSize: 13}}>
                        Show Less
                      </Text>
                      <FIcon
                        name="caret-up"
                        size={wp('4%')}
                        color="black"
                        style={{top: -2, left: 4}}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {!show && (
                  <>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingLeft: 10,
                      }}>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: '#D3FD7A',
                            width: wp('82%'),
                            flex: 0.9,
                            marginRight: wp('6.5%'),
                            color: '#222',
                          },
                        ]}
                        placeholder="Charges"
                        placeholderTextColor="#bbb"
                        value={charges?.toString()}
                        onChangeText={text => setCharges(text)}
                      />

                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: '#D3FD7A',
                            width: wp('82%'),
                            flex: 0.9,
                            marginRight: wp('6.5%'),
                            color: '#222',
                          },
                        ]}
                        placeholder="TA (in km)"
                        placeholderTextColor="#bbb"
                        value={ta?.toString()}
                        onChangeText={text => setTa(text)}
                      />
                    </View>

                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingLeft: 10,
                      }}>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: '#D3FD7A',
                            width: wp('82%'),
                            flex: 0.9,
                            marginRight: wp('6.5%'),
                            color: '#222',
                          },
                        ]}
                        placeholder="Remarks"
                        placeholderTextColor="#bbb"
                        value={engineerRemarks?.toString()}
                        onChangeText={text => setEngineerRemarks(text)}
                      />

                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: '#D3FD7A',
                            width: wp('82%'),
                            flex: 0.9,
                            marginRight: wp('6.5%'),
                            color: '#222',
                          },
                        ]}
                        placeholder="Feedback"
                        placeholderTextColor="#bbb"
                        value={feedback?.toString()}
                        onChangeText={text => setFeedback(text)}
                      />
                    </View>
                    {/* <View style={{flex: 1}}>
                      <SignatureScreen
                        ref={signatureRef}
                        onEnd={handleEnd}
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        onGetData={handleData}
                        autoClear={true}
                        descriptionText={text}
                      />
                    </View> */}
                  </>
                )}

                <View
                  style={[
                    styles.column,
                    {justifyContent: 'center', marginTop: hp('3%')},
                  ]}>
                  {status === 'Resolved' &&
                    SingleData?._id
                      ?.substring(SingleData?._id.length - 6)
                      .toUpperCase() === happyCode && (
                      <TouchableOpacity
                        style={styles.button1}
                        onPress={() => handleEngineerSubmit()}>
                        <Text style={{color: 'white'}}>Save Changes</Text>
                      </TouchableOpacity>
                    )}
                  {status !== 'Resolved' && (
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => handleEngineerSubmit()}>
                      <Text style={{color: 'white'}}>Save Changes</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </KeyboardAwareScrollView>
            </Modalize>
          )}

          <RBSheet ref={MapRef} height={height - 25}>
            <View
              style={{
                padding: 8,
                textAlign: 'center',
                alignItems: 'center',
                borderBottomWidth: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View />
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                {`User Location`}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setUserLocation();
                  MapRef.current.close();
                }}
                style={{
                  marginRight: 20,
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FIcon name="close" size={20} />
              </TouchableOpacity>
            </View>
            {!!userLocation && <CallMapView region={userLocation} />}
          </RBSheet>

          <Modalize ref={RBref2} withHandle={false} modalHeight={height - 25}>
            <ScrollView
              style={{flex: 1}}
              scrollEnabled
              keyboardShouldPersistTaps="always">
              <View
                style={{
                  padding: 8,
                  textAlign: 'center',
                  alignItems: 'center',
                  borderBottomWidth: 0.5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View />
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                  {`Reschedule - ${ReScheduleUser?.s_cus?.ACName}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    clearReSch();
                    RBref2.current.close();
                  }}
                  style={{
                    marginRight: 20,
                    height: 30,
                    width: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FIcon name="close" size={20} />
                </TouchableOpacity>
              </View>

              <View>
                {firstTimeShow && (
                  <DateTimePicker
                    value={firstTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleFirstTime}
                  />
                )}
                {secondTimeShow && (
                  <DateTimePicker
                    value={secondTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleSecondTime}
                  />
                )}
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <View>
                  <Text
                    style={{
                      // width: wp('40%'),
                      marginTop: 22,
                      fontSize: wp('3%'),
                      color: theme1.LIGHT_ORANGE_COLOR,
                      textAlign: 'center',
                      // marginLeft: 30,
                    }}>
                    Time ({firstTime?.getHours()} Hrs:
                    {firstTime?.getMinutes()} Min)
                  </Text>
                  <TouchableOpacity onPress={() => setFirstTimeShow(true)}>
                    <Text
                      style={{
                        borderWidth: 1,
                        borderColor: theme1.LIGHT_ORANGE_COLOR,
                        borderRadius: 20,
                        padding: 10,
                        paddingRight: 5,
                        marginVertical: 10,
                        color: theme1.LIGHT_ORANGE_COLOR,
                      }}>
                      Reschedule From Time
                    </Text>
                  </TouchableOpacity>
                </View>

                <View>
                  <Text
                    style={{
                      // width: wp('40%'),
                      marginTop: 22,
                      fontSize: wp('3%'),
                      color: theme1.LIGHT_ORANGE_COLOR,
                      textAlign: 'center',
                    }}>
                    Time ({secondTime?.getHours()} Hrs:
                    {secondTime?.getMinutes()} Min)
                  </Text>
                  <TouchableOpacity onPress={() => setSecondTimeShow(true)}>
                    <Text
                      style={{
                        borderWidth: 1,
                        borderColor: theme1.LIGHT_ORANGE_COLOR,
                        borderRadius: 20,
                        padding: 10,
                        marginVertical: 10,
                        color: theme1.LIGHT_ORANGE_COLOR,
                      }}>
                      Reschedule To Time
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <DatePicker
                conatinerStyles={{
                  width: wp('90%'),
                  height: 40,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  borderRadius: 5,
                  paddingLeft: 20,
                  borderColor: theme1.LIGHT_ORANGE_COLOR,
                }}
                date={reScheduleDate}
                placeholderTextColor={theme1.LIGHT_ORANGE_COLOR}
                placeholder="Date"
                setDate={setRescheduleDate}
              />

              <TextInputField
                label="Re-Schedule Remark"
                placeHolder="enter remark"
                value={reScheduleRemark}
                onChangeText={text => {
                  if (text.length <= 100) {
                    setRescheduleRemark(text);
                  }
                }}
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  height: 50,
                  marginTop: 15,
                }}
              />
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 30,
                  color: theme1.LIGHT_ORANGE_COLOR,
                }}>{`${reScheduleRemark?.length || 0}/100`}</Text>
              <View
                style={[
                  styles.column,
                  {justifyContent: 'center', marginTop: hp('2%')},
                ]}>
                <TouchableOpacity
                  style={styles.button1}
                  onPress={() => handleRescheduleChanges()}>
                  <Text style={{color: 'white'}}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modalize>

          <ImagePickerModal
            isVisible={imageModal}
            onClose={() => setImageModal(false)}
            onImageLibraryPress={pickImage}
            onCameraPress={pickFromCamera}
          />
        </React.Fragment>
      )}
    </SafeAreaView>
  );
}

export default observer(CallSummary);

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
    color: theme1.White,
  },
  tabStyle: {
    backgroundColor: theme1.White,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme1.MEDIUM_ORANGE_COLOR,
    marginTop: 5,
    marginHorizontal: 5,
  },
  activeTabStyle: {
    backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
    borderRadius: 8,
    marginTop: 5,
    marginHorizontal: 5,
  },
  button1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    backgroundColor: theme1.DARK_ORANGE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  column: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
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
  card: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 6,
    shadowColor: theme1.SemiBlack,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginBottom: 5,
    margin: 10,
    zIndex: -10,
  },
  ListButton: {
    width: '30%',
    height: 45,
    backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
    borderRadius: 7,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: theme1.White,
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
