import {NavigationContainer} from '@react-navigation/native';
import {useEffect, useState} from 'react';
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
import AuthStore from './screens/Mobx/AuthStore.js';
import SPLASH from './assets/splash.png';
import {observer} from 'mobx-react';
import {GetFCMToken, requestUserPermission} from './screens/services/notify/notificationService.js';
import {NetworkProvider} from 'react-native-offline';

LogBox.ignoreAllLogs();
Icon.loadFont();

const App = () => {
  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const usr = await AsyncStorage.getItem('user');
        // await GetFCMToken();
        await requestUserPermission();
        if (!!usr) {
          const masterid = await AsyncStorage.getItem('masterid');
          const compid = await AsyncStorage.getItem('companyCode');
          const divid = await AsyncStorage.getItem('divisionCode');
          const admin = await AsyncStorage.getItem('administrator');
          const service = await AsyncStorage.getItem('salesTeam');
          AuthStore.setIsLoggedIn(usr !== null);
          AuthStore.setUser(usr);
          AuthStore.setMasterId(masterid);
          AuthStore.setCompanyId(compid);
          AuthStore.setDivisionId(divid);
          AuthStore.setAdmin(admin);
          AuthStore.setSales(service);
        }
        AuthStore.setLoading(false);
      } catch (error) {
        console.log('Error on set All Data ---> ', JSON.stringify(error));
      }
    };
    unsubscribe();
  }, [AuthStore?.isLoggedIn]);

  if (AuthStore?.isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={SPLASH} alt="Logo" />
      </View>
    );
  }

  return (
    <NetworkProvider>
      <NativeBaseProvider>
        {!AuthStore?.isLoading ? (
          <View style={styles.container}>
            <Toast />
            {AuthStore?.isLoggedIn ? <AdminDrawer /> : <LoginDrawer />}
          </View>
        ) : (
          <View></View>
        )}
      </NativeBaseProvider>
    </NetworkProvider>
  );
};

export default observer(App);

export const Drawerbutton = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Toggle drawer" onPress={() => navigation.toggleDrawer()} />
    </View>
  );
};

export const CustomDrawerContent = props => {
  return (
    <>
      <DrawerContentScrollView
        {...props}
        style={{backgroundColor: theme1.DARK_ORANGE_COLOR}}>
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
            flexDirection: 'column',
            width: '90%',
            top: -15,
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginTop: 10,
              fontWeight: 'bold',
              fontSize: 16,
              color: 'yellow',
              textAlign: 'center',
            }}>
            {AuthStore?.user}{' '}
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
        {AuthStore?.user && (
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
                    AuthStore.setIsLoggedIn(false);
                    AuthStore.setIsAdmin(false);
                    AuthStore.setIsSales(false);
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

export const LoginDrawer = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="LoginDrawer"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="Login"
          component={Login}
          options={({navigation}) => ({
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: theme1.LIGHT_ORANGE_COLOR,
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
            },
            headerTitleStyle: {
              color: theme1.White,
            },
            title: !AsyncStorage.getItem('user')
              ? 'Shift Company/Division'
              : 'Login',
            drawerIcon: ({focused, size}) => (
              <Icon
                name="copy"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
          })}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export const AdminDrawer = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerActiveBackgroundColor: theme1.Grey,
          drawerActiveTintColor: theme1.White,
        }}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={Landing}
          options={({navigation}) => ({
            drawerIcon: ({focused, size}) => (
              <Icon
                name="home"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
            headerStyle: {
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
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
                            AuthStore.setIsLoggedIn(false);
                            AuthStore.setIsAdmin(false);
                            AuthStore.setIsSales(false);
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

        <Drawer.Screen
          name="Attendance"
          component={Attendance}
          options={({navigation}) => ({
            drawerIcon: ({focused, size}) => (
              <Icon
                name="copy"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
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

        <Drawer.Screen
          name="Attendance List"
          component={AttendanceList}
          options={({navigation}) => ({
            drawerIcon: ({focused, size}) => (
              <Icon
                name="copy"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
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

        <Drawer.Screen
          name="Call Visit Entry"
          component={CallEntry}
          options={({navigation}) => ({
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
            },
            headerTitleStyle: {
              color: theme1.HEADER_TEXT_COLOR,
            },
            drawerIcon: ({focused, size}) => (
              <Icon
                name="copy"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
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

        <Drawer.Screen
          name="Call Visit Entry List"
          component={CallEntryList}
          options={({navigation}) => ({
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
            },
            headerTitleStyle: {
              color: theme1.HEADER_TEXT_COLOR,
            },
            drawerIcon: ({focused, size}) => (
              <Icon
                name="copy"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
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

        <Drawer.Screen
          name="Call Summary"
          component={CallSummary}
          options={({navigation}) => ({
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
            },
            headerTitleStyle: {
              color: theme1.HEADER_TEXT_COLOR,
            },
            drawerIcon: ({focused, size}) => (
              <Icon
                name="copy"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
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

        <Drawer.Screen
          name="Add Party"
          component={AddParty}
          options={({navigation}) => ({
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
            },
            headerTitleStyle: {
              color: theme1.HEADER_TEXT_COLOR,
            },
            drawerIcon: ({focused, size}) => (
              <Icon
                name="copy"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
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

        <Drawer.Screen
          name="Claim Status"
          component={ClaimStatus}
          options={({navigation}) => ({
            headerStyle: {
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: theme1.MEDIUM_ORANGE_COLOR,
            },
            headerTitleStyle: {
              color: theme1.HEADER_TEXT_COLOR,
            },
            drawerIcon: ({focused, size}) => (
              <Icon
                name="home"
                reverse
                size={wp('8%')}
                color="white"
                style={{marginLeft: 8}}
              />
            ),
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
