import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Updates from "expo-updates";
import moment from "moment";
import { Form } from "native-base";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DatePicker from "react-native-datepicker";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-simple-toast";
import { host } from "../../Constants/Host";
import { ImagePickerAvatar } from "../../components/ImagePickerAvatar";
import { ImagePickerModal } from "../../components/ImagePickerModal";
import theme1 from "../../components/styles/DarkTheme";
import { widthPercentageToDP as wp } from "../../responsiveLayout/ResponsiveLayout";
const { width, height } = Dimensions.get("window");

function Attendance({ navigation, route }) {
  let rout = "";
  if (typeof route.params == "undefined") {
    rout = "none";
  } else {
    rout = route.params.routing;
  }

  const [startDate, setStartDate] = useState();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [startDayMillometerReading, setStartDayMillometerReading] = useState(0);
  const [startDayLocation, setStartDayLocation] = useState(null);
  const [startDayRemarks, setStartDayRemarks] = useState("");
  const [startDayimageSource, setStartDayImageSource] = useState(null);
  const [startDayvisible, setstartDayVisible] = useState(false);
  const [startDay, setStartDay] = useState(true);
  const [endDay, setEndDay] = useState(false);
  const [startDayLocationErrorMsg, setStartDayLocationErrorMsg] = useState(
    null
  );
  const [startDayCurrentTime, setStartDayCurrentTime] = useState();

  const [endDate, setEndDate] = useState();
  const [endDayMillometerReading, setEndDayMillometerReading] = useState(0);
  const [endDayCurrentLongitude, setEndDayCurrentLongitude] = useState("");
  const [endDaycurrentLatitude, setEndDayCurrentLatitude] = useState("");
  const [endDayRemarks, setEndDayRemarks] = useState("");
  const [endDayimageSource, setEndDayImageSource] = useState(null);
  const [endDayvisible, setEndDayVisible] = useState(false);
  const [endDayCurrentTime, setEndDayCurrentTime] = useState();

  const [vId, setVId] = useState();

  useEffect(() => {
    getStartDay();
  }, []);

  const getStartDay = async () => {
    const user = await AsyncStorage.getItem("user");
    const data = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const masterid = await AsyncStorage.getItem("masterid");
    const compid = await AsyncStorage.getItem("companyCode");
    const divid = await AsyncStorage.getItem("divisionCode");

    await fetch(
      `${host}/attendance/mobattendance_list?name=${user}&masterid=${masterid}&compid=${compid}&divid=${divid}&start_date=${new Date()}&end_date=${new Date()}`,
      data
    )
      .then((response) => response.json())
      .then((data) => {
        const obj = data.atd[data.atd.length - 1];
        let todayDate = moment(new Date()).format("YYYY-MM-DD");
        const date = obj?.Start_date?.substring(0, 10);
        const endDate = obj?.end_date;
        const id = obj?._id;

        console.log(obj, data.atd.length, todayDate, date);

        if (data.atd.length == 0) {
          setStartDay(true);
        } else {
          if (todayDate === date) {
            let todayDate = moment(new Date()).format("DD/MM/YYYY");
            var ampm = new Date().getHours() >= 12 ? "PM" : "AM";
            let minutes = new Date().getMinutes();
            if (minutes < 10) minutes = "0" + minutes;
            var time = new Date().getHours() + ":" + minutes + ampm;
            setEndDate(todayDate);
            setEndDayCurrentTime(time);
            setVId(id);
            setStartDay(false);
            setEndDay(false);
          } else {
            setEndDay(false);
            setStartDay(true);
          }
          if (date && endDate && todayDate == date) setEndDay(true);
        }
      });

    setLoading(true);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      let todayDate = moment(new Date()).format("DD/MM/YYYY");
      var ampm = new Date().getHours() >= 12 ? "PM" : "AM";
      let minutes = new Date().getMinutes();
      if (minutes < 10) minutes = "0" + minutes;
      var time = new Date().getHours() + ":" + minutes + ampm;
      setStartDate(todayDate);
      setStartDayCurrentTime(time);
    });
    return unsubscribe;
  }, [navigation]);

  const [image, setImage] = useState();
  const [imageDetails, setImageDetails] = useState();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setImageDetails(result);
    }
    setstartDayVisible(false);
  };

  const pickFromCamera = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.cancelled) {
      setImage(result.uri);
      setImageDetails(result);
    }
    setstartDayVisible(false);
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
  const handleStartDaySubmit = async () => {
    setLoading(false);
    const location = await getLocation();
    // console.log("hey",location)
    const submitData = async () => {
      // let filename = imageDetails.uri.split('/')
      const data = new FormData();
      const newImageUri =
        "file:///" + imageDetails.uri.split("file:/").join("");
      const fileToUpload = imageDetails;

      data.append("image", {
        uri: imageDetails.uri,
        type: "image/jpg", //imageDetails.type,
        name: newImageUri.split("/").pop(),
      });
      // const body = {
      //     name: await AsyncStorage.getItem("user"),
      //     att_time: startDayCurrentTime,
      //     strt_dte: startDate,
      //     millometer_reading: startDayMillometerReading,
      //     remark: startDayRemarks,
      //     usrnm: await AsyncStorage.getItem("user"),
      //     photo: "",
      //     end_day: "End",
      //     start_long:location.coords.longitude,
      //     start_lat:location.coords.latitude,
      //     co_code: await AsyncStorage.getItem("companyCode"),
      //     div_code: await AsyncStorage.getItem("divisionCode"),
      //     masterid: await AsyncStorage.getItem("masterid"),
      // }
      // Object.keys(body).forEach((key) => {
      //     data.append(key, body[key]);
      // });

      //  data.append('data',JSON.stringify(body))

      data.append("name", await AsyncStorage.getItem("user"));
      data.append("att_time", startDayCurrentTime);
      data.append("strt_dte", startDate);
      data.append("millometer_reading", startDayMillometerReading);
      data.append("remark", startDayRemarks);
      data.append("usrnm", await AsyncStorage.getItem("user"));
      data.append("photo", "");
      data.append("end_day", "End");
      data.append("start_long", location.coords.longitude);
      data.append("start_lat", location.coords.latitude);
      data.append("co_code", await AsyncStorage.getItem("companyCode"));
      data.append("div_code", await AsyncStorage.getItem("divisionCode"));
      data.append("masterid", await AsyncStorage.getItem("masterid"));
      data.append("filename", newImageUri.split("/").pop());

      // console.log(filename,"data",data,newImageUri,"body",body)

      //  console.log("data",data)
      //  console.log("body",body)
      axios({
        method: "POST",
        url: `${host}/attendance/startmobadd`,
        headers: {
          // 'Accept': 'application/json',
          "Content-Type": "multipart/form-data",
        },
        processData: false,
        contentType: false,
        data: data,
        //   body: body
      })
        .then((respone) => {
          console.log(".hey", respone);
          Toast.showWithGravity("Data Submitted.", Toast.LONG, Toast.BOTTOM);
          let todayDate = moment(new Date()).format("DD/MM/YYYY");
          var ampm = new Date().getHours() >= 12 ? "PM" : "AM";
          let minutes = new Date().getMinutes();
          if (minutes < 10) minutes = "0" + minutes;
          var time = new Date().getHours() + ":" + minutes + ampm;
          setEndDate(todayDate);
          setEndDayCurrentTime(time);
          setStartDayRemarks("");
          setStartDayMillometerReading("");
          // getStartDay()
          //      setImage(null)
          //    setImageDetails(null)
          Updates.reloadAsync();
        })
        .then((error) => {
          console.log("err", error);
        });
    };
    submitData();
    setLoading(true);
  };

  // Submit End Day Details
  const handleEndDaySubmit = async () => {
    setLoading(false);
    const location = await getLocation();
    const submitData = async () => {
      let filename = imageDetails.uri.split("/");
      const data = new FormData();
      const newImageUri =
        "file:///" + imageDetails.uri.split("file:/").join("");
      const fileToUpload = imageDetails;

      data.append("image", {
        uri: imageDetails.uri,
        type: "image/jpg", //imageDetails.type,
        name: newImageUri.split("/").pop(),
      });

      data.append("end_time", endDayCurrentTime);
      data.append("end_dte", endDate);
      data.append("end_millometer_reading", endDayMillometerReading);
      data.append("end_remark", endDayRemarks);
      data.append("vhpxendday", vId);
      data.append("photo", "");
      data.append("end_day", "");
      data.append("end_long", location.coords.longitude);
      data.append("end_lat", location.coords.latitude);

      data.append("co_code", await AsyncStorage.getItem("companyCode"));
      data.append("div_code", await AsyncStorage.getItem("divisionCode"));
      data.append("masterid", await AsyncStorage.getItem("masterid"));
      data.append("filename", newImageUri.split("/").pop());

      console.log("data", data);
      axios({
        method: "POST",
        url: `${host}/attendance/mobend_add`,
        headers: {
          // 'Accept': 'application/json',
          "Content-Type": "multipart/form-data",
        },
        processData: false,
        contentType: false,
        data: data,
      }).then((respone) => {
        console.log(respone);
        Toast.showWithGravity("Data Submitted.", Toast.LONG, Toast.BOTTOM);
        setStartDay(true);
        Updates.reloadAsync();
      });
    };
    submitData();
    setLoading(true);
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
              {!endDay && startDay && (
                <View style={styles.card}>
                  <Text style={styles.heading}>Start Day</Text>
                  <View style={[styles.column, { top: 0 }]}>
                    <ImagePickerAvatar
                      uri={startDay ? image : ""}
                      onPress={() => setstartDayVisible(true)}
                      editable={!startDay}
                    />
                    <ImagePickerModal
                      isVisible={startDayvisible}
                      onClose={() => setstartDayVisible(false)}
                      onImageLibraryPress={pickImage}
                      onCameraPress={pickFromCamera}
                    />
                  </View>

                  <View style={[styles.column, { top: 12 }]}>
                    <DatePicker
                      style={{ width: wp("40%"), borderRadius: 5, margin: 10 }}
                      date={startDate}
                      disabled={true}
                      mode="date"
                      placeholder="Date"
                      format="DD/MM/YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: "absolute",
                          left: 1000,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          borderRadius: 10,
                          marginBottom: 12,
                          marginRight: 15,
                          height: 35,
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={(date) => {
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

                  <View style={styles.column}>
                    <TextInput
                      editable={startDay}
                      keyboardType="numeric"
                      style={[styles.input, { backgroundColor: "#D3FD7A" }]}
                      placeholder="Millometer Reading"
                      defaultValue={startDayMillometerReading}
                      onChangeText={(text) =>
                        setStartDayMillometerReading(text)
                      }
                    />
                    <TextInput
                      editable={startDay}
                      style={[
                        styles.input,
                        {
                          backgroundColor: "#D3FD7A",
                          width: wp("82%"),
                          flex: 0.97,
                        },
                      ]}
                      placeholder="Remarks"
                      defaultValue={startDayRemarks}
                      onChangeText={(text) => setStartDayRemarks(text)}
                    />
                  </View>

                  <View style={[styles.column, { justifyContent: "center" }]}>
                    <TouchableOpacity
                      onPress={() => handleStartDaySubmit()}
                      style={styles.button1}
                      disabled={!startDay}
                    >
                      <Text style={{ color: "white" }}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Form>

            <Form style={styles.form}>
              {!endDay && !startDay && (
                <View style={styles.card}>
                  <Text style={styles.heading}>End Day</Text>

                  <View style={[styles.column, { top: 0 }]}>
                    <ImagePickerAvatar
                      uri={!startDay ? image : ""}
                      onPress={() => setEndDayVisible(true)}
                      editable={startDay}
                    />
                    <ImagePickerModal
                      isVisible={endDayvisible}
                      onClose={() => setEndDayVisible(false)}
                      onImageLibraryPress={pickImage}
                      onCameraPress={pickFromCamera}
                    />
                  </View>

                  <View style={[styles.column, { top: 12 }]}>
                    <DatePicker
                      style={{ width: wp("40%"), borderRadius: 5, margin: 10 }}
                      date={endDate}
                      mode="date"
                      disabled={true}
                      placeholder="Date"
                      format="DD/MM/YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: "absolute",
                          left: 1000,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          borderRadius: 10,
                          marginBottom: 12,
                          marginRight: 15,
                          height: 35,
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={(date) => {
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

                  <View style={styles.column}>
                    <TextInput
                      editable={!startDay}
                      keyboardType="numeric"
                      style={[styles.input, { backgroundColor: "#D3FD7A" }]}
                      placeholder="Millometer Reading"
                      defaultValue={endDayMillometerReading}
                      onChangeText={(text) => setEndDayMillometerReading(text)}
                    />

                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: "#D3FD7A",
                          width: wp("82%"),
                          flex: 0.97,
                        },
                      ]}
                      placeholder="Remarks"
                      editable={!startDay}
                      defaultValue={endDayRemarks}
                      onChangeText={(text) => setEndDayRemarks(text)}
                    />
                  </View>

                  <View style={[styles.column, { justifyContent: "center" }]}>
                    <TouchableOpacity
                      onPress={() => handleEndDaySubmit()}
                      style={styles.button1}
                      disabled={startDay}
                    >
                      <Text style={{ color: "white" }}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Form>

            {endDay && (
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 30,
                  textAlign: "center",
                }}
              >
                Your Day is Completed
              </Text>
            )}
          </ScrollView>
        </>
      ) : (
        <ActivityIndicator color="skyblue" size={100} />
      )}
    </>
  );
}

export default Attendance;

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
  },
  item: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
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
    elevation: 10,
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
