import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {FormControl, Input} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataTable} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {host} from '../Constants/Host';
import {widthPercentageToDP as wp} from '../responsiveLayout/ResponsiveLayout';
import AuthStore from '../Mobx/AuthStore';
import theme1 from '../components/styles/DarkTheme';
import { observer } from 'mobx-react-lite';

FontAwesomeIcon.loadFont();

const Login = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [hidePassword, setHidePassword] = useState(true);
  const [showDivision, setShowDivision] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const divisionhandler = (companycode, sdate, eDate) => {
    const company = async () => {
      AsyncStorage.setItem('companyCode', companycode);
      AsyncStorage.setItem('startingDate', sdate);
      AsyncStorage.setItem('endDate', eDate);
      setShowDivision(true);
    };
    company();
  };

  const homeHandler = (divisionCode, divName) => {
    const division = async () => {
      await AsyncStorage.setItem('divisionCode', divisionCode);
      await AsyncStorage.setItem('divisionName', divName);
      AuthStore.setIsLoggedIn(true);
    };
    division();
  };

  const loginsubmit = () => {
    setLoading(true);
    axios({
      method: 'POST',
      url: `${host}/userright/appuserlogin`,
      data: {
        usrnm: userName,
        usrpwd: password,
      },
    })
      .then(respone => {
        if (!respone.data.success) {
          setLoading(false);
          Toast.showWithGravity(respone.data.message, Toast.LONG, Toast.TOP);
        } else {
          const setItem = async () => {
            await AsyncStorage.setItem('masterid', respone.data.masterid);
            await AsyncStorage.setItem('user', respone.data.user_name);
            await AsyncStorage.setItem(
              'responseData',
              JSON.stringify(respone.data),
            );
            await AsyncStorage.setItem(
              'administrator',
              respone.data.userright.administrator,
            );
            await AsyncStorage.setItem(
              'salesTeam',
              respone.data.userright.service_team,
            );
            AuthStore.setIsAdmin(
              respone?.data?.userright?.administrator === 'Yes',
            );
            AuthStore.setIsSales(respone.data.userright.service_team === 'Yes');
            setUser(respone.data.user_name);
            setResponseData(respone.data);
            setShowCompany(true);
            setLoading(false);
          };
          setItem();
        }
      })
      .catch(error => {
        console.log('error');
        setLoading(false);
        Toast.showWithGravity(
          'Invalid Username or Password.',
          Toast.LONG,
          Toast.TOP,
        );
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let u = await AsyncStorage.getItem('user');
      setUser(await AsyncStorage.getItem('user'));
      if (u) {
        setResponseData(JSON.parse(await AsyncStorage.getItem('responseData')));
        setShowCompany(true);
        navigation.setOptions({
          title: 'Shift Company/Division',
          headerStyle: {
            backgroundColor: '#D9EDF7',
          },
        });
      } else {
        navigation.setOptions({
          title: 'Login ',
        });
        setShowCompany(false);
      }
    });

    setUserName('');
    setPassword('');
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme1.White,
        justifyContent: 'center',
      }}>
      {loading && (
        <ActivityIndicator color={theme1.DARK_ORANGE_COLOR} size={100} />
      )}
      {!user && !loading && (
        <View style={styles.container}>
          <View style={styles.form}>
            <Image
              source={{
                uri: `${host}/public/img/logo.png `,
              }}
              style={styles.image}
              resizeMode="contain"
            />

            <View style={{width: '90%'}}>
              <FormControl.Label
                style={{color: theme1.DARK_ORANGE_COLOR, fontWeight: 'bold'}}>
                Username
              </FormControl.Label>
              <Input
                value={userName}
                onChangeText={username => setUserName(username)}
                style={{color: '#000', fontWeight: 'bold'}}
                autoCompleteType="username"></Input>
            </View>

            <View style={{width: '90%'}}>
              <FormControl
                style={{color: theme1.DARK_ORANGE_COLOR, fontWeight: 'bold'}}>
                Password
              </FormControl>
              <Input
                style={{color: '#000', fontWeight: 'bold'}}
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={password => setPassword(password)}
              />
            </View>
            <View
              style={{
                position: 'relative',
                top: -30,
                left: 130,
                border: 'none',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setHidePassword(!hidePassword)}>
                {hidePassword ? (
                  <FontAwesomeIcon name="eye-slash" size={23} color="black" />
                ) : (
                  <FontAwesomeIcon name="eye" size={23} color="black" />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                onPress={() => loginsubmit()}
                style={{
                  borderRadius: 10,
                  height: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    letterSpacing: 1,
                    color: '#FFF',
                  }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{top: 10, color: '#222'}}>Forgot Password ?</Text>
          </View>
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

            {responseData.div_com?.map(dat => (
              <DataTable.Row key={dat.idr}>
                <DataTable.Cell>{dat.com_name}</DataTable.Cell>
                <DataTable.Cell>
                  {dat.sdate.substring(0, 10).split('-').reverse().join('/')}
                </DataTable.Cell>
                <DataTable.Cell>
                  {dat.edate.substring(0, 10).split('-').reverse().join('/')}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Button
                    color={theme1.DARK_ORANGE_COLOR}
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
                  padding: 20,
                  margin: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 23,
                  fontWeight: '800',
                  // paddingLeft: 85,
                  backgroundColor: theme1.LIGHT_ORANGE_COLOR,
                  width: '100%',
                  height: 50,
                  borderRadius: 10,
                  textAlign: 'center',
                  paddingTop: 10,
                  color: theme1.White
                }}>
                Division
              </Text>

              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Divison</DataTable.Title>
                  <DataTable.Title>Code</DataTable.Title>
                  <DataTable.Title>Link</DataTable.Title>
                </DataTable.Header>

                {responseData.div_mast.map(dat => (
                  <DataTable.Row>
                    <DataTable.Cell>{dat.div_mast}</DataTable.Cell>
                    <DataTable.Cell>{dat.div_code}</DataTable.Cell>
                    <DataTable.Cell>
                      <Button
                        color={theme1.DARK_ORANGE_COLOR}
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
};

export default observer(Login);

const styles = StyleSheet.create({
  image: {
    width: '40%',
    height: '30%',
  },
  form: {
    height: 370,
    // justifyContent: "center",
    alignItems: 'center',
    margin: 25,
    backgroundColor: theme1.LIGHT_ORANGE_COLOR,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#e75a19',
    borderRadius: 10,
    width: wp('50%'),
  },
});
