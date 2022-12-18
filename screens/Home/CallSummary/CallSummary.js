import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { default as Axios, default as axios } from "axios";
import * as Updates from "expo-updates";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DatePicker from "react-native-datepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { List, Searchbar } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import SegmentedControlTab from "react-native-segmented-control-tab";
import SignatureScreen from "react-native-signature-canvas";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/Feather";
import FIcon from "react-native-vector-icons/FontAwesome";
import SelectTwo from "../../components/SelectTwo";
import theme1 from "../../components/styles/DarkTheme";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "../../responsiveLayout/ResponsiveLayout";
import { ImagePickerModal } from "../../components/ImagePickerModal";

let height = Dimensions.get("window").height;

function CallSummary({ navigation, route }) {
  const [loading, setLoading] = useState(true);

  const [tableData, setTableData] = useState();
  const [searchName, setSearchName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [productName, setProductName] = useState();
  const [modelName, setModelName] = useState();
  const [uniqueId, setUniqueId] = useState();

  const [fromTime, setFromTime] = useState(false);

  const handleProductId = (item) => {
    setProductId(item.id);
  };

  // const clearAll = () => {
  //   setBuyerId("");
  //   setSellerId("");
  //   setBrokerId("");
  //   setBuyer("");
  //   setSeller("");
  //   setBroker("");
  //   setCount(count + 1);
  // };

  var RBref = useRef();

  const handleSingleIndexSelect = (index) => {
    // For single Tab Selection SegmentedControlTab
    setSelectedIndex(index);
    getDealerList(startDate, endDate, index);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      setSelectedIndex(0);
      let todayDate = moment(new Date()).format("DD/MM/YYYY");
      let date = moment(await AsyncStorage.getItem("startingDate")).format(
        "DD/MM/YYYY"
      );

      setStartDate(date);
      setEndDate(todayDate);
      getDealerList(date, todayDate, 0);
    });
    return unsubscribe;
  }, [navigation]);

  const getDealerList = async (start, end, index) => {
    setLoading(true);
    const masterid = await AsyncStorage.getItem("masterid");
    const compid = await AsyncStorage.getItem("companyCode");
    const divid = await AsyncStorage.getItem("divisionCode");
    const administrator = await AsyncStorage.getItem("administrator");
    const user = await AsyncStorage.getItem("user");
    let arr = [
      "Assigned to Asc",
      "Alloted to engineer",
      "Part-Pending",
      "Technical-Advice",
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

    axios
      .post("http://103.231.46.238:5000/call_summary/mobcall_summary", body)
      .then(function(response) {
        console.log("res ->");
        setTableData(response.data.s_call);
        setFilteredData(response.data.s_call);
      })
      .then(function(response) {
        if (loaded && index !== 0) {
          getProducts();
        } else {
          if (productItems.length !== 0) {
            setLoaded(false);
            setLoading(false);
          } else {
            setLoaded(true);
            setLoading(false);
          }
        }
      })
      .catch(function(error) {
        console.log("erro", error);
      });
  };

  const getProducts = async () => {
    console.log("products");

    axios
      .post("http://103.231.46.238:5000/call_summary/mobgetproduct", {
        masterid: await AsyncStorage.getItem("masterid"),
      })
      .then(function(response) {
        let products = [...productItems];

        response.data.product.map((dat, index) => {
          products[index] = { ...dat, id: dat._id, name: dat.Fg_Des };
        });
        setProductItems(products);
      })
      .then(function(response) {
        getModels();
      })
      .catch(function(error) {
        console.log(error, "error");
      });
  };

  const getModels = async () => {
    console.log("models");

    axios
      .post("http://103.231.46.238:5000/call_summary/mobgetmodel", {
        masterid: await AsyncStorage.getItem("masterid"),
      })
      .then(function(response) {
        let models = [...modelItems];

        response.data.model.map((dat, index) => {
          models[index] = { ...dat, id: dat._id, name: dat.Description };
        });
        setModelItems(models);
      })
      .then(function(response) {
        setLoaded(false);
        setLoading(false);
      })
      .catch(function(error) {
        console.log(error, "error");
      });
  };

  const getParticularData = (id) => {
    axios
      .get(`http://103.231.46.238:5000/s_call/mobs_call_update/${id}`)
      .then(function(response) {
        const data = response.data.s_call;
        // console.log("sfhuwhiu", response.data.rawMat_mast[0]?.raw_matrl_nm._id);
        setCharges(data?.visit_charges);
        setTa(data?.ta_km);
        setEngineerRemarks(data?.visit_remark);
        setFeedback(data?.visit_feedback);
        setInvoiceNumber(data?.invoice_no?.toString());
        setEngineerDate(data?.date);
        setProductId(data?.s_prod._id);
        setModelId(data?.s_mdl._id);
        setProductName(data?.s_prod.Fg_Des);
        setUniqueId(data?.unique_id);
        setModelName(data?.s_mdl.Description);
        // console.log("list", response.data.rawMat_mast);
        let brand = [...brandItems];
        response.data.rawMat_mast.map((dat, index) => {
          brand[index] = {
            ...brand[index],
            id: dat?.raw_matrl_nm?._id,
            name: dat?.raw_matrl_nm?.Rm_Des,
          };
        });
        setBrandItems(brand);
        setLoading(false);
        RBref.current.open();
      })
      .catch(function(error) {
        console.log(error, "error");
      });
  };

  // const getRawMast = async () => {
  //   console.log("war")
  //   axios.post('http://103.231.46.238:5000/call_summary/mobgetrawMat_mast', { masterid: await AsyncStorage.getItem("masterid") })
  //     .then(function (response) {
  //       response.data.rawMat_mast.map(dat => (
  //         setBrandItems(oldArray => [...oldArray, { id: dat._id, name: dat.Rm_Des }])
  //       ))
  //     })
  //     .catch(function (error) {
  //       console.log(error, "error")
  //     })
  //     .then(function (response) {
  //       setLoaded(false)
  //       setLoading(false)
  //     })
  // }

  const filter = (text) => {
    const array = [...tableData];
    const newArray = array.filter(
      (table) =>
        (table?.s_cus.ACName).toLowerCase().includes(text.toLowerCase()) ||
        (table.s_cus?.Address1).toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(newArray);
  };

  // Assigned to Asc
  const [technician, setTechnician] = useState("");
  const [complaintDate, setComplaintDate] = useState();
  const [complaintRemarks, setComplaintRemarks] = useState("");
  const [fromDate, setFromDate] = useState(new Date(1598051730000));
  const [vId, setVId] = useState();

  const [toTime, setToTime] = useState(false);
  const [toDate, setToDate] = useState(new Date(1598051730000));

  const handleFromChange = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setFromDate(currentDate);
    setFromTime(false);
  };

  //To Time
  const handleToChange = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setToDate(currentDate);
    setToTime(false);
  };

  const handleNewComplaint = async (id) => {
    setVId(id);
    if (selectedIndex !== 0) {
      getParticularData(id);
    } else {
      RBref.current.open();
    }
  };
  const handleAppoitmentSubmit = async () => {
    setLoading(true);
    const submitData = async () => {
      const body = {
        first_time: `${fromDate.getHours()}:${fromDate.getMinutes()}`,
        end_time: `${toDate.getHours()}:${toDate.getMinutes()}`,
        appointment_technician: technician,
        appointment_date: complaintDate,
        appointment_remark: complaintRemarks,
        vhpxappointment: vId,
        user: await AsyncStorage.getItem("user"),
        compid: await AsyncStorage.getItem("companyCode"),
        divid: await AsyncStorage.getItem("divisionCode"),
        masterid: await AsyncStorage.getItem("masterid"),
      };

      Axios({
        method: "POST",
        url: "http://103.231.46.238:5000/s_call/mobappointment_add",
        data: body,
      }).then((respone) => {
        Toast.showWithGravity("Data Submitted.", Toast.LONG, Toast.BOTTOM);
        const todayDate = moment(new Date()).format("DD/MM/YYYY");
        setFromDate(new Date(1598051730000));
        setToDate(new Date(1598051730000));
        setToTime(false);
        setFromTime(false);
        setVId("");
        setComplaintDate(todayDate);
        setComplaintRemarks("");
        setTechnician("");
      });
    };
    submitData();
    setLoading(false);
  };

  // Add Alloted to Engineer
  const [charges, setCharges] = useState("");
  const [engineerDate, setEngineerDate] = useState();
  const [engineerRemarks, setEngineerRemarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [ta, setTa] = useState(0);
  const [status, setStatus] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [warrantyType, setWarrantyType] = useState();
  const [show, setShow] = useState(true);

  const [visit_group, setArray] = useState([
    {
      visit_qty: "",
      visit_spare_part: "",
      visit_rate: "",
      visit_status: "",
      visit_model: "",
      visit_product: "",
    },
  ]);

  const [productItems, setProductItems] = useState([]);
  const [brandItems, setBrandItems] = useState([]);
  const [modelItems, setModelItems] = useState([]);

  const [selectedProductItems, setSelectedProductItems] = useState([]);
  const [selectedBrandItems, setSelectedBrandItems] = useState([]);
  const [selectedModelItems, setSelectedModelItems] = useState([]);

  const [productId, setProductId] = useState();
  const [brandId, setBrandId] = useState();
  const [modelId, setModelId] = useState();

  const [imageModal, setImageModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  // const [packValue, setpackvalue] = useState();
  // const [weight, setWeight] = useState();

  const handleProductClick = (i) => {
    setArray([
      ...visit_group,
      {
        visit_qty: "",
        visit_spare_part: "",
        visit_rate: "",
        visit_status: "",
        visit_model: "",
        visit_product: "",
      },
    ]);
  };

  const handleRemoveClick = (index) => {
    const list = [...visit_group];
    list.splice(index, 1);
    setArray(list);
  };

  const handleProductDetails = (value, index, name) => {
    const list = [...visit_group];
    list[index][name] = value;
    setArray(list);
  };

  const handleModelId = (item) => {
    setModelId(item.id);
  };

  const handleBrandId = (id) => {
    setBrandId(id);
  };

  // Signature
  const signatureRef = useRef();
  const [text, setText] = useState("her");

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
    onOK(signature); // Callback from Component props
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    signatureRef.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
  };

  const handleEngineerSubmit = async () => {
    setLoading(true);

    let array = [];

    visit_group.map((item, index) => {
      let object = Object.assign(item, { visit: index });
      array.push(object);
    });

    const submitData = async () => {
      const body = {
        visit_date: engineerDate,
        warranty_type: warrantyType,
        invoice_no: invoiceNumber,
        s_prod: productId,
        s_mdl: modelId,
        first_visit_status: status,
        visit_group: array,
        visit_charges: charges,
        visit_remark: engineerRemarks,
        ta_km: ta,
        visit_feedback: feedback,
        visit_signature: "",
        vhpxvisit: vId,
        ac_phmob: "",
        user: await AsyncStorage.getItem("user"),
        compid: await AsyncStorage.getItem("companyCode"),
        divid: await AsyncStorage.getItem("divisionCode"),
        masterid: await AsyncStorage.getItem("masterid"),
      };

      console.log("body", body);
      Axios({
        method: "POST",
        url: "http://103.231.46.238:5000/s_call/mobvisit_add",
        data: body,
      }).then((respone) => {
        Toast.showWithGravity("Data Submitted.", Toast.LONG, Toast.BOTTOM);
        const todayDate = moment(new Date()).format("DD/MM/YYYY");
        Updates.reloadAsync();
      });
    };
    submitData();
    setLoading(false);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [3, 4],
      quality: 0.7,
      allowsMultipleSelection: true,
    });
    if (!result.cancelled) {
      console.log("Images --> ", result);
      if (result.selected) {
        setSelectedImages(result?.selected);
      } else {
        setSelectedImages(result);
      }
      setImageModal(false);
    }
  };

  const pickFromCamera = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [3, 4],
      quality: 0.5,
      allowsMultipleSelection: true,
    });
    if (!result.cancelled) {
      console.log("Images --> ", result);
      setSelectedImages(result);
      setImageModal(false);
    }
  };

  return (
    <View>
      <View style={{ backgroundColor: "#CBD9F5", borderRadius: 6, margin: 10 }}>
        <SegmentedControlTab
          values={[
            "Assigned to Asc",
            "Alloted to Engineer",
            "Part Pending",
            "Tech Advice",
          ]}
          selectedIndex={selectedIndex}
          tabStyle={styles.tabStyle}
          activeTabStyle={styles.activeTabStyle}
          onTabPress={handleSingleIndexSelect}
        />
      </View>

      <Modal
        visible={loading}
        transparent
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            height: height,
            width: "100%",
            backgroundColor: "#FFF",
            opacity: 0.6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="skyblue" />
        </View>
      </Modal>

      {filteredData && (
        <>
          <View
            style={{
              borderBottomColor: "grey",
              borderBottomWidth: 0.5,
              marginBottom: 0,
              padding: 0,
              margin: 0,
            }}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Searchbar
              placeholder="Search"
              defaultValue={searchName}
              onChangeText={(text) => filter(text)}
              style={{
                borderWidth: 0.5,
                width: wp("90%"),
                height: hp("4.5%"),
                flex: 0.95,
                marginLeft: 10,
                marginTop: 10,
                padding: 5,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity
              style={{
                height: hp("6%"),
                flex: 0.1,
                marginLeft: 10,
                backgroundColor: "#D9D9D9",
                alignItems: "center",
                padding: 5,
                borderRadius: 10,
                marginTop: 5,
                paddingLeft: 5,
                paddingRight: 5,
                marginRight: 5,
              }}
              onPress={() => RBref.current.close()}
            >
              <Icon
                name="filter"
                size={wp("7%")}
                color="black"
                style={{ top: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: "grey",
              borderBottomWidth: 0.5,
              marginBottom: 0,
              padding: 0,
              margin: 10,
            }}
          />

          <View>
            <FlatList
              data={filteredData}
              initialNumToRender={10}
              renderItem={({ item, index }) => {
                return (
                  <View key={index}>
                    <List.Section>
                      <List.Accordion
                        title={`${item.s_cus?.ACName},${item?.s_cus?.CityName?.CityName}`}
                        description={`${item.s_cus?.Address1},${item.s_cus?.MobileNo}`}
                        handleLeft={() => {
                          handleNewComplaint(item._id);
                        }}
                      >
                        <View key={index + "a"}>
                          <View
                            style={{
                              borderBottomColor: "black",
                              borderBottomWidth: 0.5,
                              marginBottom: 0,
                              padding: 0,
                              margin: 0,
                            }}
                          />

                          <View
                            style={{
                              backgroundColor: theme1.LIGHT_BLUE_COLOR,
                            }}
                          >
                            <List.Item
                              title="Model"
                              description={item.s_mdl?.Description}
                              style={{
                                borderRightWidth: 0.8,
                                fontSize: 8,
                              }}
                            />
                            <List.Item
                              title="Product"
                              description={item.s_prod?.Fg_Des}
                              style={{
                                borderRightWidth: 0.8,
                              }}
                            />
                            <List.Item
                              title="Brand"
                              description={item.s_bnd?.Description}
                              style={{
                                borderRightWidth: 0.8,
                              }}
                            />
                            <List.Item
                              title="Qty."
                              description={item?.s_qty}
                              style={{
                                borderRightWidth: 0.8,
                              }}
                            />
                            <List.Item
                              title="Status"
                              description={item?.s_stus}
                            />
                          </View>
                        </View>
                      </List.Accordion>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: 10,
                          borderRightWidth: 0.6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            backgroundColor: theme1.MEDIUM_BLUE_COLOR,
                            borderRadius: 5,
                            color: "#FFF",
                            paddingLeft: 10,
                            height: 30,
                            textAlignVertical: "center",
                          }}
                        >
                          {item?.unique_id}.
                        </Text>

                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <TouchableOpacity
                            style={styles.ListButton}
                            onPress={() => {
                              if (item?._id) {
                                setLoading(true);
                                getParticularData(item?._id);
                              }
                            }}
                          >
                            <View>
                              <Text style={styles.ListButtonText}>Submit</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.ListButton}
                            onPress={() => {
                              item?.s_cus?.MobileNo &&
                                Linking.openURL(
                                  `tel:${item?.s_cus?.MobileNo}`
                                ).catch((err) => {
                                  console.error("An error occurred", err);
                                });
                            }}
                          >
                            <View>
                              <Text style={styles.ListButtonText}>
                                {item?.s_cus?.MobileNo}
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.ListButton}
                            onPress={() => {
                              item?.s_cus?.ac_altno &&
                                Linking.openURL(
                                  `tel:${item?.s_cus?.ac_altno}`
                                ).catch((err) => {
                                  console.error("An error occurred", err);
                                });
                            }}
                          >
                            <View>
                              <Text style={styles.ListButtonText}>
                                {item?.s_cus?.ac_altno}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </List.Section>

                    <View
                      style={{
                        borderBottomColor: "grey",
                        borderBottomWidth: 0.5,
                        marginBottom: 0,
                        padding: 0,
                        margin: 0,
                      }}
                    />
                  </View>
                );
              }}
            />

            {selectedIndex === 0 && (
              <RBSheet
                animationType="fade"
                ref={RBref}
                openDuration={250}
                customStyles={{
                  container: {
                    borderTopEndRadius: 20,
                    borderTopStartRadius: 20,
                    backgroundColor: theme1.LIGHT_BLUE_COLOR,
                    height: hp("53%"),
                  },
                }}
              >
                <View
                  style={{
                    padding: 8,
                    textAlign: "center",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View />
                  <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                    Add Assigned to Asc{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => RBref.current.close()}
                    style={{ marginRight: 20 }}
                  >
                    <FIcon name="close" size={20} />
                  </TouchableOpacity>
                </View>

                <ScrollView keyboardShouldPersistTaps="always">
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
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                    }}
                  >
                    <View style={{ flex: 0.35 }}>
                      <Text
                        style={{
                          width: wp("50%"),
                          flex: 0.4,
                          marginTop: 22,
                          fontSize: wp("3%"),
                        }}
                      >
                        Time ({fromDate?.getHours()} Hrs:
                        {fromDate?.getMinutes()} Min)
                      </Text>
                      <TouchableOpacity onPress={() => setFromTime(true)}>
                        <Text
                          style={{
                            borderWidth: 1,
                            borderRadius: 20,
                            padding: 10,
                            marginVertical: 10,
                          }}
                        >
                          Select From Time
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.2 }}>
                      <Text
                        style={{
                          width: wp("10%"),
                          flex: 0.2,
                          marginTop: 22,
                          fontSize: wp("3%"),
                        }}
                      >
                        To
                      </Text>
                    </View>

                    <View style={{ flex: 0.35 }}>
                      <Text
                        style={{
                          width: wp("50%"),
                          flex: 0.3,
                          marginTop: 22,
                          fontSize: wp("3%"),
                        }}
                      >
                        Time ({toDate?.getHours()} Hrs:{toDate?.getMinutes()}{" "}
                        Min)
                      </Text>
                      <TouchableOpacity onPress={() => setToTime(true)}>
                        <Text
                          style={{
                            borderWidth: 1,
                            borderRadius: 20,
                            padding: 10,
                            marginVertical: 10,
                          }}
                        >
                          Select To Time
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        width: wp("10%"),
                        flex: 0.3,
                        marginTop: 15,
                        fontSize: wp("3%"),
                      }}
                    >
                      Technician
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: "#D3FD7A",
                          width: wp("82%"),
                          flex: 0.9,
                          marginRight: wp("6.5%"),
                        },
                      ]}
                      placeholder="Technician"
                      defaultValue={technician}
                      onChangeText={(text) => setTechnician(text)}
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        width: wp("10%"),
                        flex: 0.45,
                        marginTop: 22,
                        fontSize: wp("3%"),
                      }}
                    >
                      Date:
                    </Text>
                    <DatePicker
                      style={{
                        width: wp("100%"),
                        borderRadius: 5,
                        margin: 10,
                        flex: 1.6,
                      }}
                      date={complaintDate}
                      mode="date"
                      placeholder="Date"
                      format="DD/MM/YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: "absolute",
                          left: 40000,
                          top: 9,
                          marginLeft: 0,
                          height: hp("2.8%"),
                          width: wp("3.5%"),
                        },
                        dateInput: {
                          borderRadius: 10,
                          marginRight: 15,
                          height: hp("4%"),
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={(date) => {
                        setComplaintDate(date);
                      }}
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        width: wp("10%"),
                        flex: 0.3,
                        marginTop: 15,
                        fontSize: wp("3%"),
                      }}
                    >
                      Remark{" "}
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: "#D3FD7A",
                          width: wp("82%"),
                          flex: 0.9,
                          marginRight: wp("6.5%"),
                        },
                      ]}
                      placeholder="Remarks"
                      defaultValue={complaintRemarks}
                      onChangeText={(text) => setComplaintRemarks(text)}
                    />
                  </View>

                  <View
                    style={[
                      styles.column,
                      { justifyContent: "center", marginTop: hp("2%") },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => handleAppoitmentSubmit()}
                    >
                      <Text style={{ color: "white" }}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </RBSheet>
            )}

            {(selectedIndex == 1 || selectedIndex == 2) && (
              <RBSheet
                animationType="slide"
                ref={RBref}
                closeDuration={1}
                openDuration={1}
                customStyles={{
                  container: {
                    borderTopEndRadius: 20,
                    borderTopStartRadius: 20,
                    backgroundColor: theme1.LIGHT_BLUE_COLOR,
                    height: hp("80%"),
                  },
                }}
              >
                <View
                  style={{
                    padding: 8,
                    textAlign: "center",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View />
                  <Text style={{ fontSize: 17, fontWeight: "bold" }}>
                    {selectedIndex == 1
                      ? "Add Alloted to Engineer"
                      : "Part-Pending"}{" "}
                    -{uniqueId}{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      RBref.current.close();
                    }}
                    style={{
                      marginRight: 20,
                      height: 30,
                      width: 30,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FIcon name="close" size={20} />
                  </TouchableOpacity>
                </View>

                <ScrollView keyboardShouldPersistTaps="always">
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                    }}
                  >
                    <DropDownPicker
                      items={[
                        { label: "In-Warranty", value: "In-Warranty" },
                        { label: "Out-Warranty", value: "Out-Warranty" },
                        { label: "New", value: "New" },
                      ]}
                      containerStyle={{
                        height: 35,
                        width: wp("37%"),
                        top: hp("0.8%"),
                        marginLeft: 10,
                        flex: 1.25,
                      }}
                      itemStyle={{}}
                      dropDownStyle={{
                        backgroundColor: "#fafafa",
                        width: wp("37%"),
                        marginTop: 5,
                      }}
                      onChangeItem={(item) => setWarrantyType(item.value)}
                      name="warrantyType"
                      placeholder="Select Warranty"
                      style={{ left: -5, backgroundColor: "transparent" }}
                    />

                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: "#D3FD7A",
                          width: wp("82%"),
                          flex: 1,
                          height: hp("4.7%"),
                          top: hp("0.3%"),
                          marginRight: wp("5%"),
                        },
                      ]}
                      placeholder="Invoice No."
                      value={invoiceNumber}
                      onChangeText={(text) => setInvoiceNumber(text)}
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: 10,
                    }}
                  >
                    <DropDownPicker
                      items={[
                        { label: "Resolved", value: "Resolved" },
                        { label: "Part-Pending", value: "Part-Pending" },
                        {
                          label: "Technical-Advice",
                          value: "Technical-Advice",
                        },
                        { label: "Cancel", value: "Cancel" },
                      ]}
                      containerStyle={{
                        height: 35,
                        width: wp("37%"),
                        top: hp("0.8%"),
                        marginLeft: 10,
                        flex: 1.1,
                      }}
                      // style={{
                      //   backgroundColor: '#D3FD7A'
                      // }}
                      itemStyle={{}}
                      dropDownStyle={{
                        backgroundColor: "#fafafa",
                        width: wp("37%"),
                        marginTop: 5,
                        elevation: 15,
                      }}
                      onChangeItem={(item) => setStatus(item.value)}
                      name="status"
                      placeholder="Select Status"
                      style={{ left: -5, backgroundColor: "transparent" }}
                    />
                    <DatePicker
                      style={{
                        width: wp("100%"),
                        borderRadius: 5,
                        margin: 10,
                        flex: 1,
                      }}
                      date={engineerDate}
                      mode="date"
                      placeholder="Date"
                      format="DD/MM/YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: "absolute",
                          left: 40000,
                          top: 9,
                          marginLeft: 0,
                          height: hp("2.5%"),
                          width: wp("3.5%"),
                        },
                        dateInput: {
                          borderRadius: 10,
                          marginRight: 0,
                          height: hp("4.6%"),
                          right: wp("1.5%"),
                          bottom: hp("0.5%"),
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={(date) => {
                        setEngineerDate(date);
                      }}
                    />
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "95%",
                      alignSelf: "center",
                    }}
                  >
                    <SelectTwo
                      items={modelItems}
                      selectedItem={selectedModelItems}
                      handleId={handleModelId}
                      defaultValue={modelName}
                      placeholder="Model"
                      borderColor="#ccc"
                    />

                    <SelectTwo
                      items={productItems}
                      selectedItem={selectedProductItems}
                      handleId={handleProductId}
                      defaultValue={productName}
                      placeholder="Product"
                      borderColor="#ccc"
                    />
                  </View>

                  <View
                    style={{
                      width: "95%",
                      alignSelf: "center",
                      marginTop: 5,
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: theme1.MEDIUM_BLUE_COLOR,
                        height: 40,
                        width: 40,
                        borderWidth: 1,
                        margin: 5,
                        borderStyle: "dashed",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setImageModal(true);
                      }}
                    >
                      <Text style={{ fontSize: 30, color: "#000" }}>+</Text>
                    </TouchableOpacity>

                    {selectedImages?.uri && (
                      <Image
                        style={{
                          height: 40,
                          width: 40,
                          resizeMode: "cover",
                          margin: 5,
                        }}
                        source={{ uri: selectedImages?.uri }}
                      />
                    )}

                    {selectedImages?.length > 0 &&
                      selectedImages?.map((singleImage, index) => {
                        return (
                          <Image
                            key={index + "I"}
                            style={{
                              height: 40,
                              width: 40,
                              resizeMode: "cover",
                              margin: 5,
                            }}
                            source={{ uri: singleImage?.uri }}
                          />
                        );
                      })}
                  </View>

                  <View style={{ marginTop: 0 }}>
                    {visit_group.map((x, i) => (
                      <View key={i} style={styles.card}>
                        <View style={styles.column}>
                          <SelectTwo
                            items={brandItems}
                            name="visit_spare_part"
                            selectedItem={selectedBrandItems}
                            handleId={handleBrandId}
                            handleProduct={handleProductDetails}
                            width={wp("37%")}
                            placeholder="Spare Part"
                            i={i}
                            product={x}
                            borderColor="#ccc"
                          />

                          <DropDownPicker
                            items={[
                              { label: "Installed", value: "Installed" },
                              { label: "Pending", value: "Pending" },
                              { label: "Shipped", value: "Shipped" },
                              { label: "Delivered", value: "Delivered" },
                              { label: "In-Process", value: "In-Process" },
                            ]}
                            defaultValue={x.visit_status}
                            containerStyle={{
                              height: 35,
                              width: wp("37%"),
                              top: hp("0.8%"),
                              marginLeft: 10,
                              flex: 1.1,
                            }}
                            // style={{
                            //   backgroundColor: '#D3FD7A'
                            // }}
                            itemStyle={{}}
                            dropDownStyle={{
                              backgroundColor: "#fafafa",
                              width: wp("37%"),
                              marginTop: 5,
                            }}
                            onChangeItem={(item) =>
                              handleProductDetails(
                                item.value,
                                i,
                                "visit_status"
                              )
                            }
                            name="visit_status"
                            placeholder="Select Status"
                            style={{ left: -5, backgroundColor: "transparent" }}
                          />
                        </View>

                        <View style={styles.column}>
                          <TextInput
                            keyboardType="numeric"
                            name="visit_qty"
                            style={[
                              styles.input,
                              {
                                backgroundColor: "#D3FD7A",
                                width: wp("37%"),
                                flex: 0.9,
                                height: hp("5%"),
                              },
                            ]}
                            placeholder="Quantity"
                            defaultValue={x.visit_qty}
                            onChangeText={(value) =>
                              handleProductDetails(value, i, "visit_qty")
                            }
                          />

                          <TextInput
                            keyboardType="numeric"
                            name="visit_rate"
                            style={[
                              styles.input,
                              {
                                backgroundColor: "#D3FD7A",
                                width: wp("37%"),
                                flex: 0.9,
                                height: hp("5%"),
                              },
                            ]}
                            placeholder="Rate"
                            defaultValue={x.visit_rate}
                            onChangeText={(value) =>
                              handleProductDetails(value, i, "visit_rate")
                            }
                          />
                        </View>

                        <View
                          style={[
                            styles.column,
                            {
                              justifyContent: "space-around",
                              marginBottom: 20,
                              margin: 10,
                            },
                          ]}
                        >
                          {visit_group.length - 1 === i && (
                            <TouchableOpacity
                              onPress={() => handleProductClick(i)}
                              style={[
                                styles.button,
                                { flex: 1, marginRight: 10 },
                              ]}
                            >
                              <Text style={{ color: "white" }}>
                                Add Product
                              </Text>
                            </TouchableOpacity>
                          )}

                          {visit_group.length !== 1 ? (
                            <TouchableOpacity
                              onPress={() => handleRemoveClick(i)}
                              style={styles.button}
                            >
                              <Text style={{ color: "white" }}>Remove</Text>
                            </TouchableOpacity>
                          ) : (
                            <></>
                          )}
                        </View>
                      </View>
                    ))}

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingLeft: 20,
                      }}
                    >
                      {show ? (
                        <TouchableOpacity
                          onPress={() => setShow(!show)}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Text style={{ color: "grey", fontSize: 13 }}>
                            Show More
                          </Text>
                          <FIcon
                            name="caret-down"
                            size={wp("4%")}
                            color="black"
                            style={{ top: -2, left: 4 }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => setShow(!show)}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Text style={{ color: "grey", fontSize: 13 }}>
                            Show Less
                          </Text>
                          <FIcon
                            name="caret-up"
                            size={wp("4%")}
                            color="black"
                            style={{ top: -2, left: 4 }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {!show && (
                      <>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingLeft: 10,
                          }}
                        >
                          <TextInput
                            style={[
                              styles.input,
                              {
                                backgroundColor: "#D3FD7A",
                                width: wp("82%"),
                                flex: 0.9,
                                marginRight: wp("6.5%"),
                              },
                            ]}
                            placeholder="Charges"
                            value={charges}
                            onChangeText={(text) => setCharges(text)}
                          />

                          <TextInput
                            style={[
                              styles.input,
                              {
                                backgroundColor: "#D3FD7A",
                                width: wp("82%"),
                                flex: 0.9,
                                marginRight: wp("6.5%"),
                              },
                            ]}
                            placeholder="TA (in km)"
                            value={ta}
                            onChangeText={(text) => setTa(text)}
                          />
                        </View>

                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            paddingLeft: 10,
                          }}
                        >
                          <TextInput
                            style={[
                              styles.input,
                              {
                                backgroundColor: "#D3FD7A",
                                width: wp("82%"),
                                flex: 0.9,
                                marginRight: wp("6.5%"),
                              },
                            ]}
                            placeholder="Remarks"
                            value={engineerRemarks}
                            onChangeText={(text) => setEngineerRemarks(text)}
                          />

                          <TextInput
                            style={[
                              styles.input,
                              {
                                backgroundColor: "#D3FD7A",
                                width: wp("82%"),
                                flex: 0.9,
                                marginRight: wp("6.5%"),
                              },
                            ]}
                            placeholder="Feedback"
                            value={feedback}
                            onChangeText={(text) => setFeedback(text)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <SignatureScreen
                            //     ref={signatureRef}
                            onEnd={handleEnd}
                            onOK={handleOK}
                            onEmpty={handleEmpty}
                            onClear={handleClear}
                            onGetData={handleData}
                            autoClear={true}
                            descriptionText={text}
                          />
                        </View>
                      </>
                    )}
                  </View>

                  <View
                    style={[
                      styles.column,
                      { justifyContent: "center", marginTop: hp("3%") },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => handleEngineerSubmit()}
                    >
                      <Text style={{ color: "white" }}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>

                  <ImagePickerModal
                    isVisible={imageModal}
                    onClose={() => setImageModal(false)}
                    onImageLibraryPress={pickImage}
                    onCameraPress={pickFromCamera}
                  />
                </ScrollView>
              </RBSheet>
            )}
          </View>
        </>
      )}
    </View>
  );
}

export default CallSummary;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  singleHead: { width: 80, height: 40, backgroundColor: "#c8e1ff" },
  title: { backgroundColor: "#f6f8fa" },
  titleText: { textAlign: "center" },
  text: { textAlign: "center" },
  btn: {
    width: 58,
    height: 18,
    marginHorizontal: 7,
    backgroundColor: "#c8e1ff",
    borderRadius: 2,
    justifyContent: "center",
  },
  btnText: { textAlign: "center" },
  cnt: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
    justifyContent: "flex-start",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  tabStyle: {
    borderColor: theme1.MEDIUM_BLUE_COLOR,
  },
  activeTabStyle: {
    backgroundColor: theme1.MEDIUM_BLUE_COLOR,
  },
  button1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: wp("40%"),
    backgroundColor: theme1.DARK_BLUE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  column: {
    display: "flex",
    flexDirection: "row",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: wp("40%"),
    top: 4,
    left: 0,
    backgroundColor: theme1.DARK_BLUE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  input: {
    height: 35,
    flex: 1,
    width: wp("22%"),
    borderStartWidth: 2,
    borderColor: "grey",
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
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    padding: 10,
    marginBottom: 5,
    margin: 10,
    zIndex: -10,
  },
  ListButton: {
    width: "30%",
    height: 45,
    backgroundColor: theme1.MEDIUM_BLUE_COLOR,
    borderRadius: 7,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  ListButtonText: {
    textAlignVertical: "center",
    fontSize: 14,
    color: "#FFF",
  },
});
