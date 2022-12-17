// http://103.231.46.238:5000/userright/login
// "image": "http://13.233.147.124:3000/public/img/logo.png",

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Updates from "expo-updates";
import { Form, Input, Item, Label } from "native-base";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";
import Toast from "react-native-simple-toast";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { widthPercentageToDP as wp } from "../responsiveLayout/ResponsiveLayout";
function Login(props) {
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [hidePassword, setHidePassword] = useState(true);
  const [showDivision, setShowDivision] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const divisionhandler = (companycode, sdate, eDate) => {
    const company = async () => {
      AsyncStorage.setItem("companyCode", companycode);
      AsyncStorage.setItem("startingDate", sdate);
      AsyncStorage.setItem("endDate", eDate);
      setShowDivision(true);
    };
    company();
  };

  const homeHandler = (divisionCode, divName) => {
    const division = async () => {
      AsyncStorage.setItem("divisionCode", divisionCode);
      AsyncStorage.setItem("divisionName", divName);
      //    props.navigation.navigate('Home')
      Updates.reloadAsync();
    };
    division();
  };

  const loginsubmit = () => {
    setLoading(true);
    axios({
      method: "POST",
      url: "http://103.231.46.238:5000/userright/appuserlogin",
      data: {
        usrnm: userName,
        usrpwd: password,
      },
    })
      .then((respone) => {
        if (!respone.data.success) {
          setLoading(false);
          Toast.showWithGravity(respone.data.message, Toast.LONG, Toast.TOP);
        } else {
          const setItem = async () => {
            await AsyncStorage.setItem("masterid", respone.data.masterid);
            await AsyncStorage.setItem("user", respone.data.user_name);
            await AsyncStorage.setItem(
              "responseData",
              JSON.stringify(respone.data)
            );
            await AsyncStorage.setItem(
              "administrator",
              respone.data.userright.administrator
            );
            await AsyncStorage.setItem(
              "salesTeam",
              respone.data.userright.service_team
            );
            setUser(respone.data.user_name);
            setResponseData(respone.data);
            setShowLogin(false);
            setShowCompany(true);
            setLoading(false);
          };
          setItem();
        }
      })
      .catch((error) => {
        console.log("error");
        setLoading(false);
        Toast.showWithGravity(
          "Invalid Username or Password.",
          Toast.LONG,
          Toast.TOP
        );
      });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", async () => {
      let u = await AsyncStorage.getItem("user");
      setUser(await AsyncStorage.getItem("user"));
      console.log(await AsyncStorage.getItem("responseData"), "response");
      if (u) {
        setResponseData(JSON.parse(await AsyncStorage.getItem("responseData")));
        setShowLogin(false);
        setShowCompany(true);
        props.navigation.setOptions({
          title: "Shift Company/Division",
          headerStyle: {
            backgroundColor: "#D9EDF7",
          },
        });
      } else {
        props.navigation.setOptions({
          title: "Login ",
        });
        setShowLogin(true);
        setShowCompany(false);
      }
    });

    setUserName("");
    setPassword("");
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator color="skyblue" size={100} />}
      {!user && (
        <View style={styles.container}>
          <Form style={styles.form}>
            <Image
              source={{
                uri: `http://103.231.46.238:5000/public/img/logo.png `,
              }}
              style={styles.image}
              resizeMode="contain"
            />

            <Item floatingLabel>
              <Label style={{ color: "#e75a19", fontWeight: "bold" }}>
                Username
              </Label>
              <Input
                value={userName}
                onChangeText={(username) => setUserName(username)}
                style={{ color: "#000", fontWeight: "bold" }}
                autoCompleteType="username"
              ></Input>
            </Item>

            <Item floatingLabel>
              <Label style={{ color: "#e75a19", fontWeight: "bold" }}>
                Password
              </Label>
              <Input
                style={{ color: "#000", fontWeight: "bold" }}
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={(password) => setPassword(password)}
              />
            </Item>
            <Item
              style={{
                position: "relative",
                top: -30,
                left: 130,
                border: "none",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHidePassword(!hidePassword)}
              >
                {hidePassword ? (
                  <FontAwesomeIcon name="eye-slash" size={23} color="black" />
                ) : (
                  <FontAwesomeIcon name="eye" size={23} color="black" />
                )}
              </TouchableOpacity>
            </Item>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => loginsubmit()}
                style={{
                  borderRadius: 10,
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "600", letterSpacing: 1, color: "#FFF" }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ top: 10 }}>Forgot Password ?</Text>
          </Form>
        </View>
      )}

      {user && showCompany && (
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Company</DataTable.Title>
              <DataTable.Title>Start Date</DataTable.Title>
              <DataTable.Title>End Date</DataTable.Title>
              <DataTable.Title>Enter</DataTable.Title>
            </DataTable.Header>

            {responseData.div_com?.map((dat) => (
              <DataTable.Row>
                <DataTable.Cell>{dat.com_name}</DataTable.Cell>
                <DataTable.Cell>
                  {dat.sdate
                    .substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </DataTable.Cell>
                <DataTable.Cell>
                  {dat.edate
                    .substring(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Button
                    onPress={() =>
                      divisionhandler(dat._id, dat.sdate, dat.edate)
                    }
                    title="Click  "
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

          {showDivision && (
            <>
              <View
                style={{
                  borderBottomColor: "grey",
                  borderBottomWidth: 1,
                  marginBottom: 0,
                  padding: 20,
                  margin: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: "800",
                  paddingLeft: 85,
                  backgroundColor: "#D9EDF7",
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  textAlign: "left",
                  paddingTop: 10,
                }}
              >
                Division
              </Text>

              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Divison</DataTable.Title>
                  <DataTable.Title>Code</DataTable.Title>
                  <DataTable.Title>Link</DataTable.Title>
                </DataTable.Header>

                {responseData.div_mast.map((dat) => (
                  <DataTable.Row>
                    <DataTable.Cell>{dat.div_mast}</DataTable.Cell>
                    <DataTable.Cell>{dat.div_code}</DataTable.Cell>
                    <DataTable.Cell>
                      <Button
                        title="Enter  "
                        onPress={() => homeHandler(dat._id, dat.div_code)}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  image: {
    width: "40%",
    height: "30%",
  },
  form: {
    height: 370,
    // justifyContent: "center",
    alignItems: "center",
    margin: 25,
    backgroundColor: "#E9E9E9",
    borderRadius: 20,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#e75a19",
    borderRadius: 10,
    width: wp("50%"),
  },
});
