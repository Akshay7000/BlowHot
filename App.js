// import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  Image,
  LogBox,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import theme1 from "./screens/components/styles/DarkTheme.js";
import Login from "./screens/screen/Login";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "./screens/responsiveLayout/ResponsiveLayout";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AddParty from "./screens/Home/AddParty/AddParty";
import Attendance from "./screens/Home/Attendance/Attendance";
import AttendanceList from "./screens/Home/Attendance/AttendanceList";
import CallEntry from "./screens/Home/CallEntry/CallEntry";
import CallEntryList from "./screens/Home/CallEntry/CallEntryList";
import CallSummary from "./screens/Home/CallSummary/CallSummary";
import ClaimStatus from "./screens/Home/ClaimStatus/ClaimStatus";
import Landing from "./screens/Home/Landing/Landing";
import { host } from "./screens/Constants/Host.js";

LogBox.ignoreAllLogs(true);

var u;
var administrator;
var salesTeam;

const Stack = createStackNavigator();

export default function App(props) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var isCancelled = false;
    const unsubscribe = async () => {
      u = await AsyncStorage.getItem("user");
      administrator = await AsyncStorage.getItem("administrator");
      salesTeam = await AsyncStorage.getItem("salesTeam");
      setUser(u);
      setLoading(true);
    };
    unsubscribe();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      {loading && (
        <View style={styles.container}>
          <Toast ref={(ref) => Toast.setRef(ref)} />
          <MyDrawer usera={u} admin={administrator} sales={salesTeam} />
        </View>
      )}
    </>
  );
}

export function LoginStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={({ navigation }) => ({
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#E9E9E9",
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
          },
          title: !AsyncStorage.getItem("user")
            ? "Shift Company/Division"
            : "Login",
        })}
      />
      <Stack.Screen
        name="Home"
        component={Landing}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#D9EDF7",
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
          headerRight: (props) => {
            return (
              <TouchableOpacity
                style={{ marginRight: 30 }}
                onPress={() =>
                  Alert.alert(
                    "Logout alert",
                    "Do you really want to Logout...",
                    [
                      {
                        text: "NO",
                        onPress: () => console.warn("NO Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "YES",
                        onPress: () => {
                          AsyncStorage.removeItem("user");
                          // navigation.navigate("Login");
                          console.log("restarting");
                          Updates.reloadAsync();
                        },
                      },
                    ]
                  )
                }
              >
                <Icon
                  name="sign-out"
                  size={wp("10%")}
                  style={{ marginLeft: 12 }}
                />
              </TouchableOpacity>
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Landing}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: "black",
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },

          headerRight: (props) => {
            return (
              <TouchableOpacity
                style={{ marginRight: 30 }}
                onPress={() =>
                  Alert.alert(
                    "Logout alert",
                    "Do you really want to Logout...",
                    [
                      {
                        text: "NO",
                        onPress: () => console.warn("NO Pressed"),
                        style: "cancel",
                      },
                      {
                        text: "YES",
                        onPress: () => {
                          AsyncStorage.removeItem("user");
                          navigation.navigate("Login");
                          Updates.reloadAsync();
                        },
                      },
                    ]
                  )
                }
              >
                <Icon name="sign-out" size={wp("7%")} />
              </TouchableOpacity>
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function AttendanceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Attendance"
        component={Attendance}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function AttendanceListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Attendance List"
        component={AttendanceList}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function CallVisitEntryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Call Visit Entry"
        component={CallEntry}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function CallVisitEntryListStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Call Visit Entry List"
        component={CallEntryList}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function ClaimStatusStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Claim Status"
        component={ClaimStatus}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
            marginTop: 100,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}

export function AddPartyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Add Party"
        component={AddParty}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
            marginTop: 100,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}

export function CallSummaryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Call Summary"
        component={CallSummary}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function ComingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Claim Status"
        component={ClaimStatus}
        options={({ navigation }) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: (props) => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp("7%")}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{ marginLeft: 30 }}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}

export function Drawerbutton({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
}

export function CustomDrawerContent(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      setUser(await AsyncStorage.getItem("user"));
    };
    getUser();
  }, [props.navigation]);

  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={{ backgroundColor: theme1.DARK_BLUE_COLOR }}
      >
        <View
          style={{
            marginLeft: wp("12%"),
            width: wp("100%"),
            textAlign: "center",
          }}
        >
          <Image
            source={{ uri: `${host}/public/img/logo.png ` }}
            style={{ height: hp("10%"), width: wp("45%") }}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            width: wp("50%"),
            top: -20,
          }}
        >
          <Text
            style={{
              marginLeft: wp("27%"),
              marginTop: 10,
              fontWeight: "bold",
              fontSize: wp("4%"),
              marginRight: 25,
              color: "yellow",
              textAlign: "center",
              marginBottom: 0,
            }}
          >
            {user}{" "}
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: "grey",
            borderBottomWidth: 1,
            marginBottom: 0,
            padding: 0,
            marginBottom: 10,
          }}
        />

        <DrawerItemList {...props} />
        {user && (
          <TouchableOpacity
            style={{ marginRight: 30 }}
            onPress={() => {
              Alert.alert("Logout alert", "Do you really want to Logout...", [
                {
                  text: "NO",
                  onPress: () => console.warn("NO Pressed"),
                  style: "cancel",
                },
                {
                  text: "YES",
                  onPress: () => {
                    AsyncStorage.removeItem("user");
                    // props.navigation.navigate("Posts");
                    console.log("restarting");
                    Updates.reloadAsync();
                  },
                },
              ]);
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: 20,
                paddingTop: 20,
              }}
            >
              <Icon
                name="sign-out"
                size={wp("8%")}
                color="white"
                style={{ marginLeft: 12 }}
              />
              <Text
                style={{
                  fontSize: wp("4%"),
                  paddingLeft: 18,
                  paddingTop: 3,
                  marginRight: 15,
                  color: "white",
                }}
              >
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </DrawerContentScrollView>
    </>
  );
}

const Drawer = createDrawerNavigator();

export function MyDrawer({ usera, admin, sales }) {
  console.log("admin", admin, sales);
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        drawerContentOptions={{
          activeTintColor: "white",
          activeBackgroundColor: "#1B1B1B",
          inactiveTintColor: "white",

          labelStyle: {
            marginLeft: -10,
            fontSize: wp("4%"),
            width: wp("50%"),
          },
        }}
      >
        {!usera && (
          <Drawer.Screen
            name="Login"
            component={LoginStack}
            options={{
              drawerIcon: ({ focused, size }) => (
                <Icon
                  name="copy"
                  reverse
                  size={wp("8%")}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              ),
            }}
          />
        )}
        {usera && (
          <>
            {admin ? (
              <>
                <Drawer.Screen
                  name="Home"
                  component={HomeStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="home"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Attendance"
                  component={AttendanceStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Call Visit Entry"
                  component={CallVisitEntryStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Attendance List"
                  component={AttendanceListStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Call Visit Entry List"
                  component={CallVisitEntryListStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Call Summary"
                  component={CallSummaryStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Add Party"
                  component={AddPartyStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Claim Status"
                  component={ComingStack}
                  options={{
                    drawerIcon: ({ focused, size }) => (
                      <Icon
                        name="home"
                        reverse
                        size={wp("8%")}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    ),
                  }}
                />
              </>
            ) : (
              <>
                {!sales ? (
                  <>
                    <Drawer.Screen
                      name="Home"
                      component={HomeStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Coming Soon"
                      component={ComingStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Attendance"
                      component={AttendanceStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Call Visit Entry"
                      component={CallVisitEntryStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Attendance List"
                      component={AttendanceListStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Call Visit Entry List"
                      component={CallVisitEntryListStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Add Party"
                      component={AddPartyStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Drawer.Screen
                      name="Home"
                      component={HomeStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Call Summary"
                      component={CallSummaryStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Claim Status"
                      component={ComingStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Add Party"
                      component={AddPartyStack}
                      options={{
                        drawerIcon: ({ focused, size }) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp("8%")}
                            color="white"
                            style={{ marginLeft: 8 }}
                          />
                        ),
                      }}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
