import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import * as Updates from "expo-updates";
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  LogBox,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme1 from './screens/components/styles/DarkTheme.js';
import Login from './screens/screen/Login';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from './screens/responsiveLayout/ResponsiveLayout';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AddParty from './screens/Home/AddParty/AddParty';
import Attendance from './screens/Home/Attendance/Attendance';
import AttendanceList from './screens/Home/Attendance/AttendanceList';
import CallEntry from './screens/Home/CallEntry/CallEntry';
import CallEntryList from './screens/Home/CallEntry/CallEntryList';
import CallSummary from './screens/Home/CallSummary/CallSummary';
import ClaimStatus from './screens/Home/ClaimStatus/ClaimStatus';
import Landing from './screens/Home/Landing/Landing';
import {host} from './screens/Constants/Host.js';
import {NativeBaseProvider} from 'native-base';
import SPLASH from './assets/splash.png';

LogBox.ignoreAllLogs();
Icon.loadFont();

const Stack = createStackNavigator();

export default function App(props) {
  const [u, setU] = useState();
  const [administrator, setAdministrator] = useState();
  const [salesTeam, setSalesTeam] = useState();
  const [set, setSet] = useState();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // var isCancelled = false;
    const unsubscribe = async () => {
      setU(await AsyncStorage.getItem('user'));
      setAdministrator(await AsyncStorage.getItem('administrator'));
      setSalesTeam(await AsyncStorage.getItem('salesTeam'));
      // if (!loading) {
      setLoading(true);
      // }
    };
    unsubscribe();
    return () => {
      // isCancelled = true;
    };
  }, []);
  if (!loading) {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={SPLASH} />
      </View>
    );
  }

  return (
    <NativeBaseProvider>
      {loading && (
        <View style={styles.container}>
          <Toast ref={ref => Toast.setRef(ref)} />
          <MyDrawer
            usera={u}
            admin={administrator}
            sales={salesTeam}
            setU={setU}
            setAdmin={setAdministrator}
            setSales={setSalesTeam}
          />
        </View>
      )}
    </NativeBaseProvider>
  );
}

export const LoginStack = ({setU, setAdmin, setSales}) => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={() => Login({setU, setAdmin, setSales})}
        options={({navigation}) => ({
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#E9E9E9',
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
          },
          title: !AsyncStorage.getItem('user')
            ? 'Shift Company/Division'
            : 'Login',
        })}
      />
    </Stack.Navigator>
  );
};

export const HomeStack = ({setU}) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Landing}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
            color: '#222'
          },
          headerTitleStyle:{
            color: '#222'
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },

          headerRight: props => {
            return (
              <TouchableOpacity
                style={{marginRight: 30}}
                onPress={() =>
                  Alert.alert(
                    'Logout alert',
                    'Do you really want to Logout...',
                    [
                      {
                        text: 'NO',
                        onPress: () => console.warn('NO Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'YES',
                        onPress: () => {
                          AsyncStorage.removeItem('user');
                          // navigation.navigate('Login');
                          setU(null);
                          // Updates.reloadAsync();
                        },
                      },
                    ],
                  )
                }>
                <Icon name="sign-out" size={wp('7%')} color="#222" />
              </TouchableOpacity>
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export const AttendanceStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Attendance"
        component={Attendance}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export const AttendanceListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Attendance List"
        component={AttendanceList}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export const CallVisitEntryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Call Visit Entry"
        component={CallEntry}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export const CallVisitEntryListStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Call Visit Entry List"
        component={CallEntryList}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export const ClaimStatusStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Claim Status"
        component={ClaimStatus}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
            marginTop: 100,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};

export const AddPartyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Add Party"
        component={AddParty}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
            marginTop: 100,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};

export const CallSummaryStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Call Summary"
        component={CallSummary}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export const ComingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Claim Status"
        component={ClaimStatus}
        options={({navigation}) => ({
          headerStyle: {
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
            backgroundColor: theme1.LIGHT_BLUE_COLOR,
          },
          headerTitleStyle: {
            color: theme1.HEADER_TEXT_COLOR,
          },
          headerLeft: props => {
            return (
              <Icon
                reverse
                name="bars"
                size={wp('7%')}
                color={theme1.HEADER_TEXT_COLOR}
                onPress={() => navigation.toggleDrawer()}
                style={{marginLeft: 30}}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
};

export const Drawerbutton = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
};

export const CustomDrawerContent = props => {
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      setUser(await AsyncStorage.getItem('user'));
    };
    getUser();
  }, [props.navigation]);

  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={{backgroundColor: theme1.DARK_BLUE_COLOR}}>
        <View
          style={{
            marginLeft: wp('12%'),
            width: wp('100%'),
            textAlign: 'center',
          }}>
          <Image
            source={{uri: `${host}/public/img/logo.png `}}
            style={{height: hp('10%'), width: wp('45%')}}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: wp('50%'),
            top: -20,
          }}>
          <Text
            style={{
              marginLeft: wp('27%'),
              marginTop: 10,
              fontWeight: 'bold',
              fontSize: wp('4%'),
              marginRight: 25,
              color: 'yellow',
              textAlign: 'center',
              marginBottom: 0,
            }}>
            {user}{' '}
          </Text>
        </View>
        <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
            marginBottom: 0,
            padding: 0,
            marginBottom: 10,
          }}
        />

        <DrawerItemList {...props} />
        {user && (
          <TouchableOpacity
            style={{marginRight: 30}}
            onPress={() => {
              Alert.alert('Logout alert', 'Do you really want to Logout...', [
                {
                  text: 'NO',
                  onPress: () => console.warn('NO Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'YES',
                  onPress: () => {
                    AsyncStorage.removeItem('user');
                    // props.navigation.navigate("Posts");
                    console.log('restarting');
                    // Updates.reloadAsync();
                  },
                },
              ]);
            }}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                paddingLeft: 20,
                paddingTop: 20,
              }}>
              <Icon
                name="sign-out"
                size={wp('8%')}
                color="white"
                style={{marginLeft: 12}}
              />
              <Text
                style={{
                  fontSize: wp('4%'),
                  paddingLeft: 18,
                  paddingTop: 3,
                  marginRight: 15,
                  color: 'white',
                }}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </DrawerContentScrollView>
    </>
  );
};

const Drawer = createDrawerNavigator();

export const MyDrawer = ({usera, admin, sales, setU, setAdmin, setSales}) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={() => ({
          headerShown: false,
        })}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        {!usera && (
          <Drawer.Screen
            name="Home"
            component={() => LoginStack({setU, setAdmin, setSales})}
            options={{
              drawerIcon: ({focused, size}) => (
                <Icon
                  name="copy"
                  reverse
                  size={wp('8%')}
                  color="white"
                  style={{marginLeft: 8}}
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
                  component={() => HomeStack({setU})}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="home"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Attendance"
                  component={AttendanceStack}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Call Visit Entry"
                  component={CallVisitEntryStack}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Attendance List"
                  component={AttendanceListStack}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Call Visit Entry List"
                  component={CallVisitEntryListStack}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Call Summary"
                  component={CallSummaryStack}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Add Party"
                  component={AddPartyStack}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="copy"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
                      />
                    ),
                  }}
                />

                <Drawer.Screen
                  name="Claim Status"
                  component={ComingStack}
                  options={{
                    drawerIcon: ({focused, size}) => (
                      <Icon
                        name="home"
                        reverse
                        size={wp('8%')}
                        color="white"
                        style={{marginLeft: 8}}
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
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Coming Soon"
                      component={ComingStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Attendance"
                      component={AttendanceStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Call Visit Entry"
                      component={CallVisitEntryStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Attendance List"
                      component={AttendanceListStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Call Visit Entry List"
                      component={CallVisitEntryListStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Add Party"
                      component={AddPartyStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
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
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />

                    <Drawer.Screen
                      name="Call Summary"
                      component={CallSummaryStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Claim Status"
                      component={ComingStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="home"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
                          />
                        ),
                      }}
                    />
                    <Drawer.Screen
                      name="Add Party"
                      component={AddPartyStack}
                      options={{
                        drawerIcon: ({focused, size}) => (
                          <Icon
                            name="copy"
                            reverse
                            size={wp('8%')}
                            color="white"
                            style={{marginLeft: 8}}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
