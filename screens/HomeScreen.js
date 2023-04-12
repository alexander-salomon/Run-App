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
import { insertOne, fetchMany, initial, clearDatabase } from "../SQL";

const GOOGLE_MAPS_APIKEY = "AIzaSyA5pKR19AiLn7-Xi25msy1Y8Q9-X5FtIxY";

const HomeScreen = ({ navigation }) => {
  const [locations, setLocations] = useState([]);

  const [location, setLocation] = useState(false);
  const [CurrentTime, setCurrentTime] = useState();

  const [IsRunnning, setIsRunnning] = useState(false);
  const [StartButton, setStartButton] = useState("Start Running");
  const [DistanceButton, setDistanceButton] = useState("Distance");
  const [PaceButton, setPaceButton] = useState("Pace");

  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [stroke, setStroke] = useState(5);

  const [location2, setLocation2] = useState({ latitude: 0, longitude: 0 });

  var RunningVar = IsRunnning;

  const getLocation = async (isRunningVar, locations_t) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        console.log("locations: " + locations_t);
        if (isRunningVar == true) {
          console.log("Getting Location");
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.log("Permission to access location was denied");
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          //setLocation2(location.coords);
          let temp_locations = locations_t;
          temp_locations.push({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          //setLocations(temp_locations);
          resolve(location.coords, temp_locations);
        }
      } catch (msg) {
        reject(msg);
      }
    });

    return promise;
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      getLocation(RunningVar, locations).then((result1, result2) => {
        console.log("    ffsdfsdgs:  " + result1 + "    vkdjhfl: " + result2);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [RunningVar, locations]);

  React.useEffect(() => {
    const getLocation2 = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation2(location.coords);
    };

    getLocation2();
  }, []);

  const startRunning = () => {
    console.log(locations);
    console.log(IsRunnning);
    if (IsRunnning == true) {
      setLocations([]);
      lol = false;
      const date = new Date();
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const savedDate = "" + day + ". " + month + "";
      insertOne("Saved_Run", {
        Distance: "" + DistanceButton + "",
        Duration: "" + CurrentTime + "",
        Pace: PaceButton,
        Date: savedDate,
      }).then(() => {
        fetchMany("Saved_Run").then((result) => {
          var bigest_id = 0;
          var i = 0;
          for (i = 0; i < result.length; i++) {
            if (bigest_id < result[i].id) {
              bigest_id = result[i].id;
            }
          }
          console.log(bigest_id);
          console.log(locations);
          var x = 0;
          for (x = 0; x < locations.length; x++) {
            insertOne("Path", {
              Latitude: locations[x].latitude,
              Longitude: locations[x].longitude,
              RunId: bigest_id,
              number: x,
            });
          }
        });
        setIsRunnning(false);
        setStartButton("Start Runnning");
        setDistanceButton("Distance");
        setPaceButton("Pace");
        setIsStopwatchStart(false);
        setResetStopwatch(true);
      });
    } else {
      lol = true;
      //getLocation();
      setIsRunnning(true);
      setStartButton("Stop Runnning");
      setDistanceButton(0);
      setPaceButton("min/km");
      setIsStopwatchStart(!isStopwatchStart);
      setResetStopwatch(false);
      setLocations([]);
    }
  };

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
        <View style={styles.rowContainer}>
          <Text
            style={styles.header1}
            onPress={() => {
              clearDatabase().then(() => initial());
            }}
          >
            Welcome!
          </Text>
          <TouchableOpacity
            style={styles.userIcon}
            onPress={() => navigation.navigate("UserData")}
          >
            <FontAwesome5
              name={"user-alt"}
              size={16}
              color={"black"}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            />
          </TouchableOpacity>
        </View>
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
            <Text style={styles.smallBoxText}>{DistanceButton}</Text>
          </View>
          <View style={styles.smallBox}>
            <Text style={styles.smallBoxText}>{PaceButton}</Text>
          </View>
        </View>
        <View style={styles.bigBox}>
          <Stopwatch
            laps
            start={isStopwatchStart}
            //To start
            reset={resetStopwatch}
            //To reset
            options={options}
            //options for the styling
            getTime={(time) => {
              //console.log(time);
              setCurrentTime(time);
            }}
          />
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
          region={{
            latitude: location2.latitude,
            longitude: location2.longitude,
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
            strokeWidth={stroke}
            strokeColor={"#4c8bf5"}
          />
          <MapViewDirections
            origin={locations[0]}
            destination={locations[1]}
            apikey={GOOGLE_MAPS_APIKEY}
          />
        </MapView>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bottomBtn} onPress={startRunning}>
          <Text style={styles.bottomBtnText}>{StartButton}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const options = {
  container: {
    padding: 5,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#000",
    marginLeft: 7,
  },
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: "#FF7B44",
  },

  rowContainer: {
    flexDirection: "row",
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
