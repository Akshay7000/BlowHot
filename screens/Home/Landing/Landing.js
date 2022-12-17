import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import React, { useEffect } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "../../responsiveLayout/ResponsiveLayout";
import moment from "moment";
import { Grid, Row, Col } from "react-native-easy-grid";
import { useState } from "react";
function Landing(props) {
  const [admin, setAdmin] = useState();
  const [sales, setSales] = useState();

  const attendanceHandler = () => {
    props.navigation.navigate("Attendance");
  };

  const attendanceListHandler = () => {
    props.navigation.navigate("Attendance List");
  };

  const callVisitEntryHandler = () => {
    props.navigation.navigate("Call Visit Entry");
  };

  const callVisitEntryListHandler = () => {
    props.navigation.navigate("Call Visit Entry List");
  };

  const callSummaryHandler = () => {
    props.navigation.navigate("Call Summary");
  };

  const claimStatusHandler = () => {
    props.navigation.navigate("Claim Status");
  };

  const comingSoonHandler = () => {
    props.navigation.navigate("Claim Status");
  };

  useEffect(() => {
    const use = async () => {
      console.log("setting");
      var startDate = moment(await AsyncStorage.getItem("startingDate")).format(
        "DD/MM/YYYY"
      );
      var endDate = moment(await AsyncStorage.getItem("endDate")).format(
        "DD/MM/YYYY"
      );
      var divisionCode = await AsyncStorage.getItem("divisionName");
      setAdmin(await AsyncStorage.getItem("administrator"));
      setSales(await AsyncStorage.getItem("salesTeam"));
      props.navigation.setOptions({
        headerTitle: () => {
          return (
            <View style={{ diplay: "flex", flexDirection: "row" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: wp("4.5%"),
                  marginTop: 5,
                }}
              >
                Home
              </Text>
              <View
                style={{
                  diplay: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginLeft: 30,
                }}
              >
                <Text style={{ fontWeight: "bold", color: "blue" }}>
                  {divisionCode}
                </Text>
                <Text style={{ fontWeight: "bold", color: "blue" }}>
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
    <ScrollView style={styles.container}>
      {admin ? (
        <Grid>
          <Row
            style={[
              styles.container1,
              { borderBottomColor: "black", borderBottomWidth: 0.5 },
            ]}
          >
            <Col
              style={[
                styles.container1,
                { borderRigthColor: "black", borderRightWidth: 0.5 },
              ]}
            >
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => attendanceHandler()}
              >
                <Image
                  source={require("../../../assets/Deal.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Attendance</Text>
              </TouchableOpacity>
            </Col>
            <Col
              style={[
                styles.container1,
                { borderRigthColor: "black", borderRightWidth: 0.5 },
              ]}
            >
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => callVisitEntryHandler()}
              >
                <Image
                  source={require("../../../assets/contractentry.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Call Visit Entry</Text>
              </TouchableOpacity>
            </Col>
          </Row>

          <Row
            style={[
              styles.container1,
              { borderBottomColor: "black", borderBottomWidth: 0.5 },
            ]}
          >
            <Col
              style={[
                styles.container1,
                { borderRigthColor: "black", borderRightWidth: 0.5 },
              ]}
            >
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => attendanceListHandler()}
              >
                <Image
                  source={require("../../../assets/register.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Attendance List</Text>
              </TouchableOpacity>
            </Col>
            <Col
              style={[
                styles.container1,
                { borderRigthColor: "black", borderRightWidth: 0.5 },
              ]}
            >
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => callVisitEntryListHandler()}
              >
                <Image
                  source={require("../../../assets/billing.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Visit List</Text>
              </TouchableOpacity>
            </Col>
          </Row>

          <Row
            style={[
              styles.container1,
              { borderBottomColor: "black", borderBottomWidth: 0.5 },
            ]}
          >
            <Col
              style={[
                styles.container1,
                { borderRigthColor: "black", borderRightWidth: 0.5 },
              ]}
            >
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => callSummaryHandler()}
              >
                <Image
                  source={require("../../../assets/register.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Call Summary</Text>
              </TouchableOpacity>
            </Col>
            <Col
              style={[
                styles.container1,
                { borderRigthColor: "black", borderRightWidth: 0.5 },
              ]}
            >
              <TouchableOpacity
                style={styles.icon}
                activeOpacity={0.8}
                onPress={() => comingSoonHandler()}
              >
                <Image
                  source={require("../../../assets/billing.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Claim Status</Text>
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      ) : (
        <>
          {!sales ? (
            <Grid>
              <Row
                style={[
                  styles.container1,
                  { borderBottomColor: "black", borderBottomWidth: 0.5 },
                ]}
              >
                <Col
                  style={[
                    styles.container1,
                    { borderRigthColor: "black", borderRightWidth: 0.5 },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.icon}
                    activeOpacity={0.8}
                    onPress={() => attendanceHandler()}
                  >
                    <Image
                      source={require("../../../assets/Deal.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.text}>Attendance</Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  style={[
                    styles.container1,
                    { borderRigthColor: "black", borderRightWidth: 0.5 },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.icon}
                    activeOpacity={0.8}
                    onPress={() => callVisitEntryHandler()}
                  >
                    <Image
                      source={require("../../../assets/contractentry.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.text}>Call Visit Entry</Text>
                  </TouchableOpacity>
                </Col>
              </Row>

              <Row
                style={[
                  styles.container1,
                  { borderBottomColor: "black", borderBottomWidth: 0.5 },
                ]}
              >
                <Col
                  style={[
                    styles.container1,
                    { borderRigthColor: "black", borderRightWidth: 0.5 },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.icon}
                    activeOpacity={0.8}
                    onPress={() => attendanceListHandler()}
                  >
                    <Image
                      source={require("../../../assets/register.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.text}>Attendance List</Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  style={[
                    styles.container1,
                    { borderRigthColor: "black", borderRightWidth: 0.5 },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.icon}
                    activeOpacity={0.8}
                    onPress={() => callVisitEntryListHandler()}
                  >
                    <Image
                      source={require("../../../assets/billing.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.text}>Visit List</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
            </Grid>
          ) : (
            <Grid>
              <Row
                style={[
                  styles.container1,
                  { borderBottomColor: "black", borderBottomWidth: 0.5 },
                ]}
              >
                <Col
                  style={[
                    styles.container1,
                    { borderRigthColor: "black", borderRightWidth: 0.5 },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.icon}
                    activeOpacity={0.8}
                    onPress={() => callSummaryHandler()}
                  >
                    <Image
                      source={require("../../../assets/register.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.text}>Call Summary</Text>
                  </TouchableOpacity>
                </Col>
                <Col
                  style={[
                    styles.container1,
                    { borderRigthColor: "black", borderRightWidth: 0.5 },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.icon}
                    activeOpacity={0.8}
                    onPress={() => comingSoonHandler()}
                  >
                    <Image
                      source={require("../../../assets/billing.png")}
                      style={styles.image}
                      resizeMode="contain"
                    />
                    <Text style={styles.text}>Claim Status</Text>
                  </TouchableOpacity>
                </Col>
              </Row>
            </Grid>
          )}
        </>
      )}

      <View
        style={{ height: hp("15%"), marginTop: hp(!sales ? "51.8%" : "68%") }}
      >
        <View style={{ height: hp("9%"), zIndex: 20 }} resizeMode="contain">
          <TouchableOpacity
          //   onPress={() => Linking.openURL('http://softsauda.com/userright/login')}
          >
            <Image
              source={{
                uri: `http://103.231.46.238:5000/public/img/logo.png `,
              }}
              style={{
                height: hp("13%"),
                width: wp("10%"),
                zIndex: 22,
                marginLeft: 10,
                top: hp("4.5%"),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            textAlign: "center",
            paddingTop: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
            color: "white",
            height: hp("20%"),
            borderRadius: 20,
            top: -15,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("http://softsauda.com/userright/login")
            }
          >
            <Text
              style={{
                textAlign: "center",
                paddingTop: 0,
                fontSize: wp("3.5%"),
                color: "black",
                fontWeight: "bold",
                left: 25,
              }}
            >
              {" "}
              © 2020 Complete Canvassing Accounting Solution
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default Landing;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    top: 4,
    left: 0,
    backgroundColor: "skyblue",
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  image: {
    justifyContent: "center",
    width: wp("15%"),
    height: hp("10%"),
    borderRadius: 15,
    paddingRight: 0,
  },
  appButtonContainer: {
    elevation: 8,
    width: wp("42%"),
    height: hp("16%"),
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  appButtonText: {
    fontSize: wp("5%"),
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    marginTop: 10,
  },
  container1: {
    alignItems: "center",
    justifyContent: "center",
  },
  appButtonContainer1: {
    elevation: 8,
    width: wp("44%"),
    height: hp("16%"),
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  appButtonText1: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
    marginTop: 10,
  },

  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#4B77BE",
    height: hp("100%"),
  },
  icon: {
    marginBottom: 15,
    width: wp("40%"),
    padding: 5,
    marginLeft: wp("15%"),
    height: hp("14%"),
  },
  text: {
    fontSize: wp("4.2%"),
    color: "white",
    top: 5,
    left: -3,
  },
});
