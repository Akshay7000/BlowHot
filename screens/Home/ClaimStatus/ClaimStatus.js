import React, {useLayoutEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {widthPercentageToDP as wp} from '../../responsiveLayout/ResponsiveLayout';
import AuthStore from '../../Mobx/AuthStore';
import theme1 from '../../components/styles/DarkTheme';

function ClaimStatus() {
  const navigation = useNavigation();
  const [ClaimData, setClaimData] = useState([]);

  useLayoutEffect(() => {
    getClaimStatus();
  }, []);

  const getClaimStatus = async () => {
    try {
      const res = await axios.get(
        `${AuthStore?.host}/loc_tour_claim/mobget_loc_tour_claimlist?username=${AuthStore?.user}`,
      );
      // const res = await axios.get(
      //   `${AuthStore?.host}/loc_tour_claim/mobget_loc_tour_claimlist?username=Munishk`,
      // );
      console.log(res?.data?.data);
      setClaimData(res?.data?.data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {ClaimData.length > 0 ? (
        <ScrollView style={{flex: 1}}>
          {ClaimData?.map((item, index) => {
            return (
              <View
                style={{
                  width: '90%',
                  alignSelf: 'center',
                  marginVertical: 5,
                  borderRadius: 8,
                  borderColor: theme1?.DARK_ORANGE_COLOR,
                  borderWidth: 1,
                  paddingVertical: 5,
                }}>
                <View style={styles.detail_view}>
                  <Text style={styles.detail_label}>Date:- </Text>
                  <Text style={styles.detail_value}>
                    {moment(item?.so_date).format('DD/MM/YYYY')}
                  </Text>
                </View>
                <View style={styles.detail_view}>
                  <Text style={styles.detail_label}>User Name:- </Text>
                  <Text style={styles.detail_value}>
                    {item?.username?.usrnm}
                  </Text>
                </View>
                <View style={styles.detail_view}>
                  <Text style={styles.detail_label}>Month:- </Text>
                  <Text style={styles.detail_value}>{item?.month}</Text>
                </View>
                <View style={styles.detail_view}>
                  <Text style={styles.detail_label}>Total KMs:- </Text>
                  <Text style={styles.detail_value}>{item?.totkms}</Text>
                </View>
                <View style={styles.detail_view}>
                  <Text style={styles.detail_label}>Total Amount:- </Text>
                  <Text style={styles.detail_value}>{item?.totamt}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.notfound}>No Data Found</Text>
          <TouchableOpacity
            style={[styles.button1, {marginTop: 0}]}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{color: 'white'}}>Go Back</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

export default observer(ClaimStatus);

const styles = StyleSheet.create({
  notfound: {
    color: theme1?.DARK_ORANGE_COLOR,
    fontSize: 24,
    fontWeight: '700',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('40%'),
    height: 40,
    backgroundColor: theme1.DARK_ORANGE_COLOR,
    marginTop: 20,
    borderRadius: 10,
  },
  detail_view: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
  },
  detail_label: {
    color: theme1?.DARK_ORANGE_COLOR,
    fontSize: 14,
    fontWeight: '600',
    width: 100,
  },
  detail_value: {
    color: theme1?.HEADER_TEXT_COLOR,
    fontSize: 14,
    fontWeight: '500',
    width: '70%',
  },
});
