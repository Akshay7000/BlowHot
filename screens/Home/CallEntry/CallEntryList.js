import AsyncStorage from "@react-native-async-storage/async-storage";
import Axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-datepicker";
import { ScrollView } from "react-native-gesture-handler";
import { List, Searchbar } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/Feather";
import theme1 from "../../components/styles/DarkTheme";
import { host } from "../../Constants/Host";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "../../responsiveLayout/ResponsiveLayout";

function CallEntryList({ navigation, route }) {
  const [loading, setLoading] = useState(true);

  const [tableData, setTableData] = useState();
  const [length, setLength] = useState();
  const [data, setData] = useState();
  const [searchName, setSearchName] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredData, setFilteredData] = useState();
  const [routeName, setRouteName] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const [selectedBuyerItems, setSelectedBuyerItems] = useState([]);
  const [selectedSellerItems, setSelectedSellerItems] = useState([]);
  const [selectedBrokerItems, setSelectedBrokerItems] = useState([]);

  const [buyerId, setBuyerId] = useState("");
  const [selllerId, setSellerId] = useState("");
  const [brokerId, setBrokerId] = useState("");

  const [buyerItems, setBuyerItems] = useState([]);
  const [sellerItems, setSellerItems] = useState([]);
  const [brokeritems, setBrokerItems] = useState([]);
  const [buyer, setBuyer] = useState();
  const [seller, setSeller] = useState();
  const [broker, setBroker] = useState();
  const [count, setCount] = useState(0);

  const handleBuyerId = (item) => {
    setBuyer(item.name);
    setBuyerId(item.id);
  };

  const handleSellerId = (item) => {
    setSeller(item.name);
    setSellerId(item.id);
  };
  const handleBrokerId = (item) => {
    setBroker(item.name);
    setBrokerId(item.id);
  };

  const clearAll = () => {
    setBuyerId("");
    setSellerId("");
    setBrokerId("");
    setBuyer("");
    setSeller("");
    setBroker("");
    setCount(count + 1);
  };

  useEffect(() => {
    // getDealerList(startDate,endDate,selectedIndex)
  }, [count]);

  const handleSingleIndexSelect = (index) => {
    // For single Tab Selection SegmentedControlTab
    setSelectedIndex(index);
    getDealerList(startDate, endDate, index);
  };

  var RBref = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let todayDate = moment(new Date()).format("DD/MM/YYYY");
      let date = moment(await AsyncStorage.getItem("startingDate")).format(
        "DD/MM/YYYY"
      );

      setStartDate(date);
      setEndDate(todayDate);
      setRouteName(route.name);
      getDealerList(date, todayDate, 0);
    });
    return unsubscribe;
  }, [navigation]);

  const getDealerList = async (start, end, index) => {
    setLoading(true);
    const user = await AsyncStorage.getItem("user");
    const masterid = await AsyncStorage.getItem("masterid");
    const compid = await AsyncStorage.getItem("companyCode");
    const divid = await AsyncStorage.getItem("divisionCode");
    Axios({
      method: "GET",
      url: `${host}/c_visit_entry/mob_visitlist?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${start}&end_date=${end}`,
    }).then((response) => {
      console.log(
        "responsbe",
        response.data.c_visit_entrySchema[
          response.data.c_visit_entrySchema.length - 1
        ]
      );
      setLength(response.data.c_visit_entrySchema.length);
      setData(response.data.c_visit_entrySchema);
      setTableData(response.data.c_visit_entrySchema);
      setFilteredData(response.data.c_visit_entrySchema);
    });
    setLoading(false);
  };

  const filter = (text) => {
    const array = [...tableData];
    const newArray = array.filter(
      (table) =>
        table?.Ship_party?.ACName?.toLowerCase()?.includes(
          text.toLowerCase()
        ) || table?.ac_cty?.call?.toLowerCase()?.includes(text.toLowerCase())
    );
    setFilteredData(newArray);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      {!loading ? (
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
              onPress={() => RBref.open()}
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
            {filteredData?.map((dat) => (
              <>
                <List.Section style={{ top: 8 }}>
                  <List.Accordion
                    title={`Dealer Name:${dat.Ship_party?.ACName}`}
                    description={`Call Type:${dat.ac_cty?.call}`}
                    left={(props) => (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: 10,
                          borderRightWidth: 0.6,
                        }}
                      >
                        <Text style={{ fontSize: 15 }}>{dat.vouc_code}.</Text>
                        <Text style={{ fontSize: 10 }}>
                          {dat.so_date
                            .substring(0, 10)
                            .split("-")
                            .reverse()
                            .join("/")}
                        </Text>
                      </View>
                    )}
                  >
                    {dat.sales_or_group.map((prod, i) => (
                      <>
                        <View
                          style={{
                            borderBottomColor: "black",
                            borderBottomWidth: 1,
                            marginBottom: 0,
                            padding: 0,
                            margin: 0,
                          }}
                        />

                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            backgroundColor: theme1.MEDIUM_BLUE_COLOR,
                          }}
                        >
                          <List.Item
                            title="Product"
                            description={prod.so_disc?.Fg_Des}
                            index={i}
                            style={{
                              marginTop: 5,
                              flex: 0.3,
                              borderRightWidth: 0.8,
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
                            }}
                          />
                          <List.Item
                            title="Quantity"
                            index={i}
                            description={prod.so_qty}
                            style={{ marginTop: 5, flex: 0.3 }}
                          />
                        </View>
                      </>
                    ))}
                  </List.Accordion>
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
              </>
            ))}

            <RBSheet
              animationType="fade"
              ref={(ref) => {
                RBref = ref;
              }}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopEndRadius: 20,
                  borderTopStartRadius: 20,
                  backgroundColor: theme1.LIGHT_BLUE_COLOR,
                  height: hp("40%"),
                },
              }}
            >
              <ScrollView keyboardShouldPersistTaps="always">
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
                      flex: 0.35,
                      marginTop: 22,
                      fontSize: wp("3%"),
                    }}
                  >
                    Start Date:
                  </Text>
                  <DatePicker
                    style={{
                      width: wp("80%"),
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
                      setStartDate(date);
                    }}
                  />
                  <Text
                    style={{
                      width: wp("10%"),
                      flex: 0.3,
                      marginTop: 22,
                      fontSize: wp("3%"),
                    }}
                  >
                    End Date:
                  </Text>
                  <DatePicker
                    style={{
                      width: wp("80%"),
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
                      setEndDate(date);
                    }}
                  />
                </View>

                <View style={[styles.column, { justifyContent: "center" }]}>
                  <TouchableOpacity
                    style={styles.button1}
                    onPress={() =>
                      getDealerList(startDate, endDate, selectedIndex)
                    }
                  >
                    <Text style={{ color: "white" }}>Show</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </RBSheet>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="skyblue" />
      )}
    </ScrollView>
  );
}

export default CallEntryList;
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
});
