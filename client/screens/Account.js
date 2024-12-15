import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FooterList from "../components/footer/FooterList";
import { AuthContext } from "../context/auth";
import axios from "axios";
import { API_ENDPOINTS } from "../apiConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Account = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useContext(AuthContext);

  useEffect(() => {
    if (state) {
      const { name, email, role } = state.user;
      setName(name);
      setEmail(email);
      setRole(role);
    }
  }, [state]);

  const isFormValid = password.length >= 8 && password === confirmPassword;

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      let storedData = await AsyncStorage.getItem("auth-rn");
      console.log(storedData)
      const user = JSON.parse(storedData);

      const oldPassword = user.password; 
      console.log('Old Password:', oldPassword);
      if (password === oldPassword) {
        alert("New password cannot be the same as the old password!");
        return;
      }

      const res = await axios.post(API_ENDPOINTS.UPDATE_PASSWORD, {
        password,
        user,
      });
      const data = res.data;
      if (data.error) alert(data.error);
      else {
        alert("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      alert("Password update failed!");
      console.error(err);
    }
  };

  console.log('New Password:', password);
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <ScrollView style={{ marginVertical: 10 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.imageStyle}
          />
        </View>
        <Text style={styles.signupText}>{name}</Text>
        <Text style={styles.emailText}>{email}</Text>
        <Text style={styles.roleText}>{role}</Text>

        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.labelText}>NEW PASSWORD</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.signupInput}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
              autoComplete="off"
              placeholder="Enter your new password here"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.6}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.labelText}>CONFIRM PASSWORD</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.signupInput}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={!showConfirmPassword}
              autoComplete="password"
              placeholder="Confirm your new password"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.6}
            >
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[styles.buttonStyle, { opacity: isFormValid ? 1 : 0.5 }]} 
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterList />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  signupText: {
    fontSize: 30,
    textAlign: "center",
  },
  emailText: {
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 10,
  },
  roleText: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 10,
    color: "gray",
  },
  labelText: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
  },
  signupInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "black",
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "black",
    marginBottom: 30,
    paddingRight: 10,
  },
  buttonStyle: {
    backgroundColor: "#4169e1",
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    marginHorizontal: 15,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default Account;
