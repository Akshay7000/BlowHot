import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
const DatePicker = ({
  date,
  setDate,
  placeholderTextColor,
  type = "date",
  title = "Date",
  placeholder = "Date",
  conatinerStyles,
  maxDate,
  minDate,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    var dateTime =
      type === "date"
        ? moment(date).format("DD/MM/YYYY")
        : type === "time"
        ? moment(date).format("h:mm a")
        : date;
    setDate(dateTime);
    hideDatePicker();
  };
  const styles = StyleSheet.create({
    mainContainer: {
      width: "48%",
      justifyContent: "space-between",

      borderBottomWidth: 1,
      borderRadius: 5,
      borderWidth: 1,

      paddingHorizontal: 10,
    },
    textInput: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent: "space-around",
    },
    text: {
      flex: 1,
      height: 50,

      fontSize: 14,
      fontWeight: "600",
      letterSpacing: 0.1,
      color: "black",
      borderRadius: 14,
    },
    heading: {
      color: "#6C6C6C",
      fontSize: 10,
    },
  });
  return (
    <View style={[styles.mainContainer, conatinerStyles]}>
      <TouchableOpacity onPress={() => showDatePicker()}>
        <View style={[styles.textInput]}>
          <TextInput
            returnKeyType="done"
            placeholderTextColor={
              placeholderTextColor ? placeholderTextColor : "#ccc"
            }
            placeholder={placeholder}
            style={styles.text}
            onChangeText={(value) => setDate(value)}
            editable={false}
            value={date}
          />

          {type !== "time" ? (
            <AntDesign name="calendar" size={20} />
          ) : (
            <MaterialCommunityIcons name="clock-time-eight-outline" size={20} />
          )}
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={type}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={maxDate && new Date(maxDate)}
        minimumDate={minDate && new Date(minDate)}
      />
    </View>
  );
};

export default DatePicker;
