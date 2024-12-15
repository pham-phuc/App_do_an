import { TouchableOpacity, SafeAreaView, Alert } from "react-native";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeaderTabs = () => {
  const [state, setState] = useContext(AuthContext);

  const signOut = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("auth-rn");
  };

  const handleSignOut = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel", 
        },
        {
          text: "Yes",
          onPress: signOut, 
        },
      ],
      { cancelable: true } 
    );
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          width: 50,
          height: 40,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "blue",
          borderRadius: 8,
        }}
      >
        <FontAwesome5
          name="user"
          size={14}
          color="#fff"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HeaderTabs;
