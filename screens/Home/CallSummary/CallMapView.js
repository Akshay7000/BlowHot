import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';


const {height, width} = Dimensions.get('window')

const CallMapView = ({region}) => {
  console.log(region);
  return (
    <View style={{height: height-50, width: width}}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
          ...StyleSheet.absoluteFillObject,
        }}
        initialRegion={region}
        region={region}>
          <Marker coordinate={{
            latitude: region?.latitude,
            longitude: region?.longitude
          }} />
        </MapView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CallMapView;
