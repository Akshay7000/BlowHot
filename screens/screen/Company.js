import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";

function Company() {
  const navigation = useNavigation();
  const [showDivision, setShowDivision] = useState(false);
  const [data, setData] = useState();
  const divisionhandler = (companycode) => {
    const company = async () => {
      AsyncStorage.setItem("companyCode", companycode);
      setShowDivision(true);
    };
    company();
  };

  useEffect(() => {
    const getData = async () => {
      let dat = await AsyncStorage.getItem("data")
        .then((req) => JSON.parse(req))
        .then((json) => console.log(json), setData(json))
        .catch((error) => console.log("error!"));

      setData(dat);
    };
    getData();
  }, []);

  const homeHandler = (divisionCode) => {
    const division = async () => {
      AsyncStorage.setItem("divisionCode", divisionCode);
      navigation.navigate("HomeStack",{
        screen: "Home"
      });
    };
    division();
  };
  return (
    <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Company</DataTable.Title>
          <DataTable.Title>Start Date</DataTable.Title>
          <DataTable.Title>End Date</DataTable.Title>
          <DataTable.Title>Enter</DataTable.Title>
        </DataTable.Header>

        {data.div_com?.map((dat) => (
          <DataTable.Row>
            <DataTable.Cell>{dat.com_name}</DataTable.Cell>
            <DataTable.Cell>{dat.sdate.substring(0, 10)}</DataTable.Cell>
            <DataTable.Cell>{dat.edate.substring(0, 10)}</DataTable.Cell>
            <DataTable.Cell>
              <Button onPress={() => divisionhandler(dat._id)} title="Click" />
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
              marginBottom: 20,
              padding: 20,
              margin: 10,
            }}
          />
          <Text style={{ fontSize: 23, fontWeight: "800", paddingLeft: 85 }}>
            Division
          </Text>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Divison</DataTable.Title>
              <DataTable.Title>Code</DataTable.Title>
              <DataTable.Title>Link</DataTable.Title>
            </DataTable.Header>

            {data.div_mast.map((dat) => (
              <DataTable.Row>
                <DataTable.Cell>{dat.div_mast}</DataTable.Cell>
                <DataTable.Cell>{dat.div_code}</DataTable.Cell>
                <DataTable.Cell>
                  <Button title="Enter" onPress={() => homeHandler(dat._id)} />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </>
      )}
    </ScrollView>
  );
}

export default Company;
