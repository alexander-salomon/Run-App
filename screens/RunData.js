import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import * as React from "react";
import { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MapView, { Polyline } from "react-native-maps";
import GetLocation from "react-native-get-location";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Stopwatch } from "react-native-stopwatch-timer";
//import Geolocation from "react-native-geolocation-service";
//import Geolocation from "@react-native-community/geolocation";
import * as Location from "expo-location";
import { fetchMany, initial } from "../SQL";
import { useFocusEffect } from "@react-navigation/native";

const GOOGLE_MAPS_APIKEY = "AIzaSyA5pKR19AiLn7-Xi25msy1Y8Q9-X5FtIxY";

const HomeScreen = ({ navigation, route }) => {
  const { item } = route.params;
  const [locations, setLocations] = useState([{ latitude: 0, longitude: 0 }]);

  useFocusEffect(
    React.useCallback(() => {
      fetchMany("Path")
        .then((result) => {
          let i = 0;
          console.log(result);
          var locations_temp = [];
          for (i = 0; i < result.length; i++) {
            if (result[i].RunId == item.DataID) {
              locations_temp[result[i].number] = {
                latitude: result[i].Latitude,
                longitude: result[i].Longitude,
              };
            }
          }
          if (locations_temp.length != 0) {
            setLocations(locations_temp);
          }
        })
        .catch((error) => console.error(error));
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#FF7B44",
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("UserData")}>
          <View style={styles.rowContainer}>
            <FontAwesome5
              name={"caret-left"}
              size={32}
              color={"#fff"}
              style={styles.headerIcon}
            />

            <Text style={styles.header1}>Back</Text>
          </View>
        </TouchableOpacity>

        <View
          style={[
            styles.rowContainer,
            {
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 10,
              paddingRight: 10,
            },
          ]}
        >
          <View style={styles.smallBox}>
            <Text style={styles.smallBoxText}>{item.distance}</Text>
          </View>
          <View style={styles.smallBox}>
            <Text style={styles.smallBoxText}>{item.pace}</Text>
          </View>
        </View>
        <View style={styles.bigBox}>
          <Text style={styles.bigBoxText}>{item.duration}</Text>
        </View>
      </View>
      <View
        style={{
          borderRadius: 32,
          overflow: "hidden",
        }}
      >
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          Initialegion={{
            latitude: locations[0].latitude,
            longitude: locations[0].longitude,
            latitudeDelta: 0.0012,
            longitudeDelta: 0.0011,
          }}
          followUserLocation={true}
        >
          <Polyline
            coordinates={locations.map((location) => ({
              latitude: location.latitude,
              longitude: location.longitude,
            }))}
            strokeWidth={5}
            strokeColor={"#4c8bf5"}
          />
          <MapViewDirections
            origin={locations[0]}
            destination={locations[1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="hotpink"
          />
        </MapView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    marginRight: 8,
  },

  header1: {
    //fontFamily: "Montserrat-Bold",
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FF7B44",
  },

  header1: {
    //fontFamily: "Montserrat-Bold",
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },

  userIcon: {
    backgroundColor: "#fff",
    justifyContent: "center",
    borderRadius: 100,
    padding: 12,
    marginLeft: "auto",
  },

  //Boxes

  smallBox: {
    marginTop: 16,
    width: "50%",
    height: 90,
    backgroundColor: "#fff",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },

  smallBoxText: {
    //fontFamily: "Montserrat-Bold",
    fontSize: 24,
    fontWeight: "bold",
  },
  bigBoxText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  bigBox: {
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 32,
    height: 90,
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 24,
  },

  bigBoxText: {
    //fontFamily: "Montserrat-Bold",
    fontSize: 32,
    fontWeight: "bold",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },

  bottomBtn: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FF7B44",
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  bottomBtnText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
