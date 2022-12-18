import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Updates from "expo-updates";
import moment from "moment";
import { Form } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-simple-toast";
import SelectTwo from "../../components/SelectTwo";
import theme1 from "../../components/styles/DarkTheme";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "../../responsiveLayout/ResponsiveLayout";
const { width, height } = Dimensions.get("window");

import * as Location from "expo-location";
import { Col } from "react-native-easy-grid";
import DatePicker from "../../components/DatePicker";
import { EvilIcons } from "@expo/vector-icons";

function CallEntry({ navigation, route }) {
  let masterid = "";
  let rout = "";
  if (typeof route.params == "undefined") {
    rout = "none";
  } else {
    rout = route.params.routing;
  }
  const [mobileNumber, setMobileNumber] = useState("");
  const [name, setName] = useState("");
  const [searchingCustomer, setSearchingCustomer] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dealerItems, setDealerItems] = useState([]);
  const [dealerId, setDealerId] = useState();
  const [selectedDealerItems, setSelectedDealerItems] = useState([]);

  const [callTypeItems, setCallTypeItems] = useState([]);
  const [callTypeId, setCallTypeId] = useState();
  const [selectedCallTypeItems, setSelectedCallTypeItems] = useState([]);

  const [remarks, setRemarks] = useState();

  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [followUpDate, setFollowUpDate] = useState();

  const [sales_or_group, setProductList] = useState([
    { brandid: "", so_qty: "", so_disc: "", model: "", dsirn: "" },
  ]);

  const [buyerItems, setBuyerItems] = useState([]);
  const [sellerItems, setSellerItems] = useState([]);
  const [brokeritems, setBrokerItems] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [brandItems, setBrandItems] = useState([]);
  const [modelItems, setModelItems] = useState([]);

  const [selectedBuyerItems, setSelectedBuyerItems] = useState([]);
  const [selectedSellerItems, setSelectedSellerItems] = useState([]);
  const [selectedBrokerItems, setSelectedBrokerItems] = useState([]);
  const [selectedProductItems, setSelectedProductItems] = useState([]);
  const [selectedBrandItems, setSelectedBrandItems] = useState([]);
  const [selectedModelItems, setSelectedModelItems] = useState([]);

  const [productId, setProductId] = useState();
  const [brandId, setBrandId] = useState();
  const [modelId, setModelId] = useState();

  const [brokerType, setBrokerType] = useState();
  const [packItems, setPackItems] = useState([]);
  const [packValue, setpackvalue] = useState();
  const [weight, setWeight] = useState();

  const [show, setShow] = useState(true);
  const [show1, setShow1] = useState(true);

  const onFocusChange = (name, i) => {
    if (name == "dealOne") {
      dealOneRef.current.setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "dealTwo") {
      dealTwoRef.current.setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "remarks") {
      remarksRef.current.setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "billNumber") {
      billNumberRef.current.setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "bag") {
      bagRefs.current[i].setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "rate") {
      rateRef.current[i].setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "amount") {
      amountRef.current[i].setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "buyerBrokerage") {
      buyerBrokerageRef.current[i].setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "sellerBrokerage") {
      sellerBrokerageRef.current[i].setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    } else if (name == "productRemarks") {
      productRemarksRef.current[i].setNativeProps({
        style: { backgroundColor: "#FCFE8F" },
      });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let todayDate = moment(new Date()).format("DD/MM/YYYY");
      setDate(todayDate);
      setFollowUpDate(todayDate);
    });
    return unsubscribe;
  }, [navigation]);

  const onBlurChange = (name, i) => {
    if (name == "dealOne") {
      dealOneRef.current.setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "dealTwo") {
      dealTwoRef.current.setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "remarks") {
      remarksRef.current.setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "billNumber") {
      billNumberRef.current.setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "bag") {
      bagRefs.current[i].setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "rate") {
      rateRef.current[i].setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "amount") {
      amountRef.current[i].setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "buyerBrokerage") {
      buyerBrokerageRef.current[i].setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "sellerBrokerage") {
      sellerBrokerageRef.current[i].setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    } else if (name == "productRemarks") {
      productRemarksRef.current[i].setNativeProps({
        style: { backgroundColor: "#D3FD7A" },
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      masterid = await AsyncStorage.getItem("masterid");
      PromisData(masterid);
    };
    init();
  }, []);

  const dealOneRef = useRef();
  const dealTwoRef = useRef();
  const remarksRef = useRef();
  const billNumberRef = useRef();
  const bagRefs = useRef([]);
  const rateRef = useRef([]);
  const amountRef = useRef([]);
  const buyerBrokerageRef = useRef([]);
  const sellerBrokerageRef = useRef([]);
  const productRemarksRef = useRef([]);
  const dateRef = useRef();

  //Dealers List

  const PromisData = async (masterid) => {
    setLoading(false);

    var diler = getDealers(masterid);
    var calls = getCallType(masterid);
    var product = getProducts(masterid);
    Promise.all([diler, calls, product]).then((values) => {
      setDealerItems(values[0]);
      setCallTypeItems(values[1]);
      setBrandItems(values[2].brand);
      setProductItems(values[2].products);
      setModelItems(values[2].model);
      setLoading(true);
    });
  };

  const getDealers = async (masterid) => {
    console.log("dealers");

    const data = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await fetch(
      `http://103.231.46.238:5000/c_visit_entry/mob_calldealer?masterid=${masterid}`,
      data
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("dtaa", data)
        var responseData = [...dealerItems];
        data.results.map((dat) =>
          responseData.push({ id: dat._id, name: dat.ACName })
        );

        return responseData;
      });
    getCallType();
  };

  //Call Type List
  const getCallType = async (masterid) => {
    console.log("call");

    const data = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await fetch(
      `http://103.231.46.238:5000/c_visit_entry/mob_getcall?masterid=${masterid}`,
      data
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("dtaa", data)
        var responseData = [...callTypeItems];
        data.results.map((dat) =>
          responseData.push({ id: dat.id, name: dat.CallType })
        );

        return responseData;
      });

    getProducts();
  };

  // Product List
  const getProducts = async (masterid) => {
    console.log("products");

    const data = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    return await fetch(
      `http://103.231.46.238:5000/c_visit_entry/mob_productname?masterid=${masterid}`,
      data
    )
      .then((response) => response.json())
      .then((data) => {
        let products = [];

        data.product.map((dat) =>
          products.push({ id: dat._id, name: dat.Fg_Des })
        );
        let brand = [];
        data.brand.map((dat) =>
          brand.push({ id: dat._id, name: dat.Description })
        );
        let model = [];
        data.model.map((dat) =>
          model.push({ id: dat._id, name: dat.Description })
        );
        console.log("model->>>>", data.model.length, model.length);
        return { brand, products, model };
        setBrandItems(brand);
        setProductItems(products);
        setModelItems(model);
      });

    setLoading(true);

    //       getBrands()
  };

  const handleDealerId = (item) => {
    setDealerId(item.id);
  };

  const handleModelId = (item) => {
    setModelId(item.id);
  };

  const handleCallTypeId = (item) => {
    setCallTypeId(item.id);
  };

  const handleBrandId = (id) => {
    setBrandId(id);
  };

  const handleProductClick = (i) => {
    setProductList([
      ...sales_or_group,
      { brandid: "", so_qty: "", so_disc: "", model: "", dsirn: "" },
    ]);
  };

  const handleRemoveClick = (index) => {
    const list = [...sales_or_group];
    list.splice(index, 1);
    setProductList(list);
  };

  // Change Product
  const handleProductDetails = (value, index, name) => {
    const list = [...sales_or_group];
    list[index][name] = value;
    setProductList(list);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setStartDayLocationErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    return location;
  };
  // Submit Start Day Details

  const submitData = async () => {
    const location = await getLocation();

    sales_or_group.map((item, index) => {
      item.dsirn = index + 1;
    });

    let array = sales_or_group;
    const body = {
      so_date: date,
      buy_podt: followUpDate,
      c_j_s_p: "CVE",
      vouc_code: "1",
      Ship_party: dealerId,
      buy_rmks: remarks,
      ac_cty: callTypeId,
      user: await AsyncStorage.getItem("user"),
      compid: await AsyncStorage.getItem("companyCode"),
      divid: await AsyncStorage.getItem("divisionCode"),
      long: location.coords.longitude,
      lat: location.coords.latitude,
      masterid: await AsyncStorage.getItem("masterid"),
      sales_or_group: array,
    };
    // console.log("body", body)
    axios({
      method: "POST",
      url: "http://103.231.46.238:5000/c_visit_entry/mobadd",
      data: body,
    }).then((respone) => {
      Toast.showWithGravity("Data Submitted.", Toast.LONG, Toast.BOTTOM);
      let todayDate = moment(new Date()).format("DD/MM/YYYY");
      setDate(todayDate);
      setFollowUpDate(todayDate);
      Updates.reloadAsync();
    });
  };

  const handleProductId = (id, product, index) => {
    setProductId(id);
  };
  const searchCustomer = () => {
    if (mobileNumber?.length === 10) {
      setSearchingCustomer(true);
      setTimeout(() => {
        console.log("false Loader");
        setSearchingCustomer(false);

        setName("user");
      }, 3000);
    } else {
      ToastAndroid.showWithGravity(
        "Enter Correct Mobile Number!",
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  };
  return (
    <>
      {loading ? (
        <>
          <ScrollView
            keyboardShouldPersistTaps="always"
            style={styles.container}
          >
            <Form style={styles.form}>
              <View style={[styles.column]}>
                <View
                  style={{
                    flexDirection: "column",

                    alignItems: "center",
                  }}
                >
                  <Text>Date</Text>
                  <DatePicker
                    date={date}
                    placeholder={"Select Date"}
                    setDate={setDate}
                    conatinerStyles={{
                      width: wp("40%"),
                      borderRadius: 5,
                      margin: 10,
                      borderColor: "#ccc",
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "column",

                    alignItems: "center",
                  }}
                >
                  <Text>Follow Up Date</Text>
                  <DatePicker
                    date={followUpDate}
                    placeholder={"Select Date"}
                    setDate={setFollowUpDate}
                    conatinerStyles={{
                      width: wp("40%"),
                      borderRadius: 5,
                      margin: 10,
                      borderColor: "#ccc",
                    }}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.column,
                  {
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 5,
                    justifyContent: "space-between",
                    marginHorizontal: 8,
                    paddingHorizontal: 10,
                    alignItems: "center",
                  },
                ]}
              >
                <TextInput
                  style={{
                    // width: wp("85%"),

                    height: 40,

                    // paddingHorizontal: 15,
                  }}
                  keyboardType={"phone-pad"}
                  returnKeyType="search"
                  enablesReturnKeyAutomatically={true}
                  placeholder="Customer Mobile"
                  value={mobileNumber}
                  onChangeText={(text) => setMobileNumber(text)}
                />
                {!searchingCustomer ? (
                  <TouchableOpacity onPress={() => searchCustomer()}>
                    <EvilIcons name={"search"} size={30} />
                  </TouchableOpacity>
                ) : (
                  <ActivityIndicator />
                )}
                {/* <SelectTwo
                  items={dealerItems}
                  selectedItem={selectedDealerItems}
                  handleId={handleDealerId}
                  keyboardType
                  width={wp("80%")}
                  placeholder="Mobile number"
                  borderColor="#ccc"
                /> */}
              </View>
              <View style={styles.column}>
                <TextInput
                  style={{
                    width: wp("85%"),
                    borderWidth: 1,
                    height: 40,
                    borderRadius: 5,
                    paddingHorizontal: 15,
                    borderColor: "#ccc",
                  }}
                  placeholder="Customer Name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View style={styles.column}>
                <SelectTwo
                  items={callTypeItems}
                  selectedItem={selectedCallTypeItems}
                  handleId={handleCallTypeId}
                  //   width={wp("80%")}
                  placeholder="State"
                  borderColor="#ccc"
                />
                <SelectTwo
                  items={callTypeItems}
                  selectedItem={selectedCallTypeItems}
                  handleId={handleCallTypeId}
                  //   width={wp("80%")}
                  placeholder="City"
                  borderColor="#ccc"
                />
              </View>

              <View
                style={{
                  borderBottomColor: "grey",
                  borderBottomWidth: 1,
                  marginTop: 5,
                }}
              />

              <View style={{ marginTop: 30 }}>
                {sales_or_group.map((item, i) => {
                  return (
                    <View style={styles.card}>
                      <View style={styles.column}>
                        <SelectTwo
                          items={modelItems}
                          name="model"
                          selectedItem={selectedModelItems}
                          handleId={handleModelId}
                          handleProduct={handleProductDetails}
                          //   width={wp("37%")}
                          placeholder="Model"
                          i={i}
                          defaultValue={item.model}
                          product={item}
                          borderColor="#ccc"
                        />

                        <SelectTwo
                          items={productItems}
                          name="so_disc"
                          selectedItem={selectedProductItems}
                          handleId={handleProductId}
                          handleProduct={handleProductDetails}
                          //   width={wp("37%")}
                          placeholder="Product"
                          i={i}
                          defaultValue={item.so_disc}
                          product={item}
                          borderColor="#ccc"
                        />
                      </View>
                      <View style={styles.column}>
                        <SelectTwo
                          items={brandItems}
                          name="brandid"
                          selectedItem={selectedBrandItems}
                          handleId={handleBrandId}
                          handleProduct={handleProductDetails}
                          width={wp("37%")}
                          placeholder="Brand"
                          i={i}
                          defaultValue={item.brandid}
                          product={item}
                          borderColor="#ccc"
                        />

                        <TextInput
                          keyboardType="numeric"
                          name="so_qty"
                          style={[
                            styles.input,
                            {
                              backgroundColor: "#D3FD7A",
                              width: wp("39%"),
                              //   flex: 0.9,
                              height: hp("5.5"),
                              marginTop: 5,
                            },
                          ]}
                          placeholder="Quantity"
                          onFocus={() => onFocusChange("so_qty", i)}
                          onBlur={() => onBlurChange("so_qty", i)}
                          ref={(element) => (bagRefs.current[i] = element)}
                          defaultValue={item.so_qty}
                          onChangeText={(value) =>
                            handleProductDetails(value, i, "so_qty")
                          }
                        />
                      </View>

                      <View
                        style={[
                          styles.column,
                          {
                            justifyContent: "space-around",
                            marginBottom: 20,
                          },
                        ]}
                      >
                        {sales_or_group.length - 1 === i && (
                          <TouchableOpacity
                            onPress={() => handleProductClick(i)}
                            style={[styles.button, { flex: 1 }]}
                          >
                            <Text style={{ color: "white" }}>Add Product</Text>
                          </TouchableOpacity>
                        )}

                        {sales_or_group.length !== 1 ? (
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
                  );
                })}
              </View>

              <View style={[styles.column, { justifyContent: "center" }]}>
                <TouchableOpacity
                  onPress={() => submitData()}
                  style={styles.button1}
                >
                  <Text style={{ color: "white" }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </Form>
          </ScrollView>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="skyblue" />
        </View>
      )}
    </>
  );
}

export default CallEntry;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    width: "40%",
    height: "30%",
    top: -10,
    left: 120,
  },
  dealnumber: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: hp("0.3%"),
    marginVertical: hp("0.8%"),
    // alignItems: "center",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    height: wp("10%"),
    // flex: 1,
    width: wp("22%"),
    // borderStartWidth: 2,
    // borderColor: "grey",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  progress: {
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "column",
    height: height,
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
  button1: {
    alignItems: "center",
    justifyContent: "center",
    width: wp("80%"),
    top: 4,
    left: 0,
    backgroundColor: theme1.DARK_BLUE_COLOR,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  ImageSections: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
  },
  images: {
    width: 150,
    height: 150,
    borderColor: "black",
    borderWidth: 1,
    marginHorizontal: 3,
  },
  btnParentSection: {
    alignItems: "center",
    marginTop: 10,
  },
  btnSection: {
    width: 225,
    height: 50,
    backgroundColor: "#DCDCDC",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    marginBottom: 10,
  },
  btnText: {
    textAlign: "center",
    color: "gray",
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollView: {},
  selectButtonTitle: {
    padding: 10,
    fontSize: 18,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    // elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
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
    textAlign: "center",
    color: "black",
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
});
