import React, { Component, useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, SafeAreaView, Button, ActivityIndicator, Dimensions, Image, PermissionsAndroid } from 'react-native';
import { Form, Input, Label, Item } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import SearchableDropdown from 'react-native-searchable-dropdown';
import SelectTwo from '../../components/SelectTwo'
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'
import DropDownPicker from 'react-native-dropdown-picker';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import moment from 'moment'
import Toast from 'react-native-simple-toast';
import * as Updates from 'expo-updates'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from '../../responsiveLayout/ResponsiveLayout'
import theme1 from '../../components/styles/DarkTheme'
const { width, height } = Dimensions.get('window')
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerModal } from '../../components/ImagePickerModal';
import { ImagePickerHeader } from '../../components/ImagePickerHeader';
import { ImagePickerAvatar } from '../../components/ImagePickerAvatar';
import * as Location from 'expo-location';
import { Col, Row } from 'react-native-easy-grid';

function CallEntry({ navigation, route }) {
    let rout = ""
    if (typeof (route.params) == 'undefined') {
        rout = "none"
    }
    else {
        rout = route.params.routing
    }


    const [loading, setLoading] = useState(false)

    const [dealerItems, setDealerItems] = useState([])
    const [dealerId, setDealerId] = useState()
    const [selectedDealerItems, setSelectedDealerItems] = useState([])

    const [callTypeItems, setCallTypeItems] = useState([])
    const [callTypeId, setCallTypeId] = useState()
    const [selectedCallTypeItems, setSelectedCallTypeItems] = useState([])

    const [remarks, setRemarks] = useState()

    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const [followUpDate, setFollowUpDate] = useState()


    const [sales_or_group, setProductList] = useState([{ brandid: "", so_qty: "", so_disc: "", model: "", dsirn: "" }])

    const [buyerItems, setBuyerItems] = useState([])
    const [sellerItems, setSellerItems] = useState([])
    const [brokeritems, setBrokerItems] = useState([])
    const [productItems, setProductItems] = useState([])
    const [brandItems, setBrandItems] = useState([])
    const [modelItems, setModelItems] = useState([])


    const [selectedBuyerItems, setSelectedBuyerItems] = useState([])
    const [selectedSellerItems, setSelectedSellerItems] = useState([])
    const [selectedBrokerItems, setSelectedBrokerItems] = useState([])
    const [selectedProductItems, setSelectedProductItems] = useState([])
    const [selectedBrandItems, setSelectedBrandItems] = useState([])
    const [selectedModelItems, setSelectedModelItems] = useState([])



    const [productId, setProductId] = useState();
    const [brandId, setBrandId] = useState();
    const [modelId, setModelId] = useState();


    const [brokerType, setBrokerType] = useState()
    const [packItems, setPackItems] = useState([])
    const [packValue, setpackvalue] = useState()
    const [weight, setWeight] = useState()

    const [show, setShow] = useState(true)
    const [show1, setShow1] = useState(true)

    const onFocusChange = (name, i) => {
        if (name == "dealOne") {

            dealOneRef.current.setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "dealTwo") {
            dealTwoRef.current.setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "remarks") {
            remarksRef.current.setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "billNumber") {
            billNumberRef.current.setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "bag") {
            (bagRefs.current)[i].setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "rate") {
            (rateRef.current)[i].setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "amount") {
            (amountRef.current)[i].setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "buyerBrokerage") {
            (buyerBrokerageRef.current)[i].setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "sellerBrokerage") {
            (sellerBrokerageRef.current)[i].setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }
        else if (name == "productRemarks") {
            (productRemarksRef.current)[i].setNativeProps({
                style: { backgroundColor: "#FCFE8F" }
            });
        }

    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            let todayDate = moment(new Date()).format("DD/MM/YYYY")
            setDate(todayDate)
            setFollowUpDate(todayDate)

        })
        return unsubscribe;
    }, [navigation])

    const onBlurChange = (name, i) => {

        if (name == "dealOne") {
            dealOneRef.current.setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "dealTwo") {

            dealTwoRef.current.setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "remarks") {
            remarksRef.current.setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "billNumber") {
            billNumberRef.current.setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "bag") {

            (bagRefs.current)[i].setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "rate") {
            (rateRef.current)[i].setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "amount") {
            (amountRef.current)[i].setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "buyerBrokerage") {
            (buyerBrokerageRef.current)[i].setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "sellerBrokerage") {
            (sellerBrokerageRef.current)[i].setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
        else if (name == "productRemarks") {
            (productRemarksRef.current)[i].setNativeProps({
                style: { backgroundColor: "#D3FD7A" }
            });
        }
    }




    useEffect(() => {
        getDealers();
    }, [])


    const dealOneRef = useRef()
    const dealTwoRef = useRef()
    const remarksRef = useRef()
    const billNumberRef = useRef()
    const bagRefs = useRef([])
    const rateRef = useRef([])
    const amountRef = useRef([])
    const buyerBrokerageRef = useRef([])
    const sellerBrokerageRef = useRef([])
    const productRemarksRef = useRef([])
    const dateRef = useRef()

    //Dealers List
    const getDealers = async () => {
            console.log("dealers")

        const masterid = await AsyncStorage.getItem("masterid")
        const data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        await fetch(`http://103.231.46.238:5000/c_visit_entry/mob_calldealer?masterid=${masterid}`, data)
            .then(response => response.json())
            .then(data => {
                // console.log("dtaa", data)
                data.results.map(dat => (
                    setDealerItems(oldArray => [...oldArray, { id: dat._id, name: dat.ACName }])
                ))
            })
        getCallType()
    }

    //Call Type List
    const getCallType = async () => {
        console.log("call")

        const masterid = await AsyncStorage.getItem("masterid")
        const data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        await fetch(`http://103.231.46.238:5000/c_visit_entry/mob_getcall?masterid=${masterid}`, data)

            .then(response => response.json())
            .then(data => {

                data.results.map(dat => (
                    setCallTypeItems(oldArray => [...oldArray, { id: dat.id, name: dat.CallType }])
                ))
            })
        getProducts()
    }


    // Product List
    const getProducts = async () => {
        console.log("products")
        const masterid = await AsyncStorage.getItem("masterid")
        const data = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        await fetch(`http://103.231.46.238:5000/c_visit_entry/mob_productname?masterid=${masterid}`, data)

            .then(response => response.json())
            .then(data => {
                data.product.map(dat => (
                    setProductItems(oldArray => [...oldArray, { id: dat._id, name: dat.Fg_Des }])
                ))

                data.brand.map(dat => (
                    setBrandItems(oldArray => [...oldArray, { id: dat._id, name: dat.Description }])
                ))

                data.model.map(dat => (
                    setModelItems(oldArray => [...oldArray, { id: dat._id, name: dat.Description }])
                ))

            })

        setLoading(true)

        //       getBrands()
    }


    const handleDealerId = (item) => {
        setDealerId(item.id)
    }


    const handleModelId = (item) => {
        setModelId(item.id)
    }


    const handleCallTypeId = (item) => {
        setCallTypeId(item.id)
    }

    const handleBrandId = (id) => {
        setBrandId(id)
    }

    const handleProductClick = (i) => {
        setProductList([...sales_or_group, { brandid: "", so_qty: "", so_disc: "", model: "", dsirn: "" }]);
    }

    const handleRemoveClick = index => {
        const list = [...sales_or_group];
        list.splice(index, 1);
        setProductList(list);
    };

    // Change Product
    const handleProductDetails = (value, index, name) => {
        const list = [...sales_or_group];
        list[index][name] = value;
        setProductList(list);
    };




    const getLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setStartDayLocationErrorMsg('Permission to access location was denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        return location
    }
    // Submit Start Day Details
    const handleSubmit = () => {
        const submitData = async () => {

            const location = await getLocation()

            sales_or_group.map((item, index) => {
                item.dsirn = index + 1
            })

            let array = sales_or_group
            const body = {
                so_date: date,
                buy_podt: followUpDate,
                c_j_s_p: "CVE",
                vouc_code: "1",
                Ship_party: dealerId,
                buy_rmks: remarks,
                ac_cty: callTypeId,
                user: await AsyncStorage.getItem("user"),
                compid: await AsyncStorage.getItem("companyCode"),
                divid: await AsyncStorage.getItem("divisionCode"),
                long: location.coords.longitude,
                lat: location.coords.latitude,
                masterid: await AsyncStorage.getItem("masterid"),
                sales_or_group: array
            }
            // console.log("body", body)
            axios({
                method: 'POST',
                url: "http://103.231.46.238:5000/c_visit_entry/mobadd",
                data: body
            })
                .then(respone => {
                    Toast.showWithGravity('Data Submitted.', Toast.LONG, Toast.BOTTOM);
                    let todayDate = moment(new Date()).format("DD/MM/YYYY")
                    setDate(todayDate)
                    setFollowUpDate(todayDate)
                    Updates.reloadAsync()
                })
        }
        submitData()

    }

    const handleProductId = (id, product, index) => {
        setProductId(id)
    }

    return (
        <>
            {loading ? (
                <>

                    <ScrollView keyboardShouldPersistTaps='always' style={styles.container}>

                        <Form style={styles.form}>
                            <View style={[styles.column, { top: 12 }]}>
                                <Col>
                                    <Text style={{ left: wp("10%") }}>Date</Text>
                                    <DatePicker
                                        style={{ width: wp('45%'), borderRadius: 5, margin: 10, right: wp("2%") }}
                                        date={date}
                                        mode="date"
                                        placeholder="Date"
                                        format="DD/MM/YYYY"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 1000,
                                                top: 4,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                borderRadius: 10,
                                                marginBottom: 12,
                                                marginRight: 15,
                                                height: 35
                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {
                                            setDate(date)
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <Text style={{ left: wp("7%") }}>Follow Up Date</Text>

                                    <DatePicker
                                        style={{ width: wp('46%'), borderRadius: 5, margin: 10, right: wp("3.5%") }}
                                        date={followUpDate}
                                        mode="date"
                                        placeholder="Date"
                                        format="DD/MM/YYYY"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 1000,
                                                top: 4,
                                                marginLeft: 0,
                                            },
                                            dateInput: {
                                                borderRadius: 10,
                                                marginBottom: 12,
                                                marginRight: 15,
                                                height: 35
                                            }
                                            // ... You can check the source to find the other keys.
                                        }}
                                        onDateChange={(date) => {
                                            setFollowUpDate(date)
                                        }}
                                    />

                                </Col>

                            </View>

                            <View style={styles.column}>
                                <SelectTwo items={dealerItems} selectedItem={selectedDealerItems} handleId={handleDealerId} width={wp('80%')} placeholder="Dealer/Distribution" borderColor="#ccc" />
                            </View>


                            <View style={styles.column}>
                                <TextInput
                                    style={[styles.input, { backgroundColor: "#D3FD7A", width: wp('82%'), flex: 0.9, height: hp("4.9%"), top: hp("0.3%") }]}
                                    placeholder="Remarks"
                                    defaultValue={remarks}
                                    onChangeText={text => setRemarks(text)}
                                />
                                <SelectTwo items={callTypeItems} selectedItem={selectedCallTypeItems} handleId={handleCallTypeId} width={wp('80%')} placeholder="Call Type" borderColor="#ccc" />
                            </View>


                            <View style={{ borderBottomColor: 'grey', borderBottomWidth: 1, marginTop: 5 }} />


                            <View style={{ marginTop: 30 }}>

                                {
                                    sales_or_group.map((x, i) => (
                                        <View style={styles.card}>


                                            <View style={styles.column}>

                                                <SelectTwo items={modelItems} name="model"
                                                    selectedItem={selectedModelItems}
                                                    handleId={handleModelId} handleProduct={handleProductDetails}
                                                    width={wp('37%')} placeholder="Model" i={i}
                                                    defaultValue={x.model} product={x} borderColor="#ccc" />

                                                <SelectTwo items={productItems} name="so_disc"
                                                    selectedItem={selectedProductItems}
                                                    handleId={handleProductId} handleProduct={handleProductDetails}
                                                    width={wp('37%')} placeholder="Product" i={i}
                                                    defaultValue={x.so_disc} product={x} borderColor="#ccc" />


                                            </View>
                                            <View style={styles.column}>


                                                <SelectTwo items={brandItems} name="brandid"
                                                    selectedItem={selectedBrandItems} handleId={handleBrandId}
                                                    handleProduct={handleProductDetails} width={wp('37%')}
                                                    placeholder="Brand" i={i} defaultValue={x.brandid} product={x} borderColor="#ccc" />

                                                <TextInput
                                                    keyboardType="numeric"
                                                    name="so_qty"
                                                    style={[styles.input, { backgroundColor: "#D3FD7A", width: wp('37%'), flex: 0.90, height: hp("5%") }]}
                                                    placeholder="Quantity"
                                                    onFocus={() => onFocusChange("so_qty", i)}
                                                    onBlur={() => onBlurChange("so_qty", i)}
                                                    ref={(element) => bagRefs.current[i] = element}
                                                    defaultValue={x.so_qty}
                                                    onChangeText={value => handleProductDetails(value, i, "so_qty")}
                                                />
                                            </View>

                                            <View style={[styles.column, { justifyContent: "space-around", marginBottom: 20 }]}>
                                                {
                                                    sales_or_group.length - 1 === i &&
                                                    <TouchableOpacity onPress={() => handleProductClick(i)} style={[styles.button, { flex: 1 }]}>
                                                        <Text style={{ color: "white" }}>Add Product</Text>
                                                    </TouchableOpacity>}

                                                {
                                                    sales_or_group.length !== 1 ?
                                                        <TouchableOpacity onPress={() => handleRemoveClick(i)}
                                                            style={styles.button}>
                                                            <Text style={{ color: "white" }}>Remove</Text>
                                                        </TouchableOpacity>

                                                        : (<></>)}

                                            </View>


                                        </View>

                                    ))}
                            </View>


                            <View style={[styles.column, { justifyContent: "center" }]}>
                                <TouchableOpacity onPress={() => handleSubmit()}
                                    style={styles.button1}
                                >
                                    <Text style={{ color: "white" }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </Form>


                    </ScrollView></>
            ) : (<ActivityIndicator size="large" color="skyblue"  />
            )
            }
        </>

    )
}



export default CallEntry

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center",
        width: '40%',
        height: "30%",
        top: -10,
        left: 120


    },
    dealnumber: {
        display: "flex",
        flexDirection: "row"
    },
    column: {
        display: "flex",
        flexDirection: "row",
        margin: hp("0.3%")
    },
    item: {
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
    },
    input: {
        height: 35,
        flex: 1,
        width: wp('22%'),
        borderStartWidth: 2,
        borderColor: "grey",
        borderEndWidth: 0.5,
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        margin: 4,
        padding: 8,
        borderRadius: 5
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
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 8,
        justifyContent: 'center'
    },
    images: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3
    },
    btnParentSection: {
        alignItems: 'center',
        marginTop: 10
    },
    btnSection: {
        width: 225,
        height: 50,
        backgroundColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        marginBottom: 10
    },
    btnText: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 14,
        fontWeight: 'bold'
    },
    scrollView: {
    },
    selectButtonTitle: {
        padding: 10,
        fontSize: 18
    },
    card: {
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 10,
        shadowColor: '#000',
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
        textAlign: 'center',
        color: "black",
        fontSize: wp("5%"),
        fontWeight: "bold"
    }

})
