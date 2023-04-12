import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { fetchMany, initial } from "../SQL";
import { useFocusEffect } from "@react-navigation/native";

const handleDelete = (item) => {
  //Funktion für Salodos alses
  //löschen von dings
};

const ListItem = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)}>
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={handleDelete}>
        <View style={{ paddingRight: 12 }}>
          <View style={styles.iconDelete}>
            <FontAwesome5 name={"times"} size={20} color={"red"} />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.listContainer}>
        <Text style={styles.listText}>
          {item.date} | {item.duration}
        </Text>
        <FontAwesome5
          name={"caret-right"}
          size={24}
          color={"black"}
          style={{ marginLeft: "auto", paddingRight: 8 }}
        />
      </View>
    </View>
  </TouchableOpacity>
);

const UserData = ({ navigation }) => {
  const [data, setData] = useState([
    {
      id: "1",
      DataID: 1,
      date: "12. Jul",
      duration: "2:00:00",
      pace: "12",
      distance: "20",
    },
  ]);

  const handlePress = (item) => {
    console.log(item);
    navigation.navigate("RunData", { item: item });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMany("Saved_Run")
        .then((result) => {
          let i = 0;
          let dataArray = [];
          for (i = 0; i < result.length; i++) {
            let x = i + 1;
            dataArray[i] = {
              id: "" + x,
              DataID: result[i].id,
              date: "" + result[i].Date,
              duration: "" + result[i].Duration,
              pace: "" + result[i].Pace,
              distance: "" + result[i].Distance,
            };
          }
          setData(dataArray);
        })
        .catch((error) => console.error(error));
    }, [])
  );

  return (
    <SafeAreaView style={{ backgroundColor: "#FF7B44" }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
        <Text style={styles.headerChild}>Previous runs</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListItem item={item} onPress={handlePress} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserData;

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    width: "87%",
  },
  listText: {
    //fontFamily: "Montserrat-Medium",
    fontSize: 16,
    fontWeight: "400",
    padding: 8,
  },

  iconDelete: {
    backgroundColor: "#fff",
    borderRadius: 100,
    width: 32,
    height: 32,
    justifyContent: "center",
    paddingLeft: 9,
  },

  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },

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

  headerChild: {
    //fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#fff",
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "700",
  },
});
