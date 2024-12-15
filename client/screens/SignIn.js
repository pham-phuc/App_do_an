import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/auth";
import { API_ENDPOINTS } from "../apiConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleSubmit = async () => {
    if (email === "" || password === "") {
      setErrorMessage("Both fields are required! Please fill in your email and password.");
      return;
    }

    try {
      const res = await axios.post(API_ENDPOINTS.SIGNIN, { email, password });
      if (res.data.error) {
        setErrorMessage(`Error: ${res.data.error}`);
        console.log(res.data.error);
      } else {
        setState(res.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(res.data));
        setErrorMessage(""); 
        navigation.navigate("Home");
      }
    } catch (err) {
      setErrorMessage("An error occurred while signing in. Please try again.");
      console.error(err);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={{ marginVertical: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/logo.png")} style={styles.imageStyle} />
        </View>
        <Text style={styles.signInText}>Sign In</Text>

        {/* Email Input */}
        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.labelText}>EMAIL</Text>
          <View style={styles.inputWrapper}>
            <Icon name="email" size={20} color="gray" style={styles.iconStyle} />
            <TextInput
              style={styles.signInInput}
              value={email}
              onChangeText={(text) => setEmail(text)}
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Enter your email here"
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.labelText}>PASSWORD</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="gray" style={styles.iconStyle} />
            <TextInput
              style={styles.signInInput}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword} // toggle secureTextEntry
              autoComplete="password"
              placeholder="Enter your password here"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off" : "eye"} // toggle icon
                size={20}
                color="gray"
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Display error message if any */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text style={styles.signupLink}>
          Not yet registered?{" "}
          <Text
            style={styles.signupText}
            onPress={() => navigation.navigate("SignUp")}
          >
            Sign Up
          </Text>
        </Text>
        <Text
          onPress={() => navigation.navigate("ForgotPassword")}
          style={styles.forgotText}
        >
          Forgot Password?
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  forgotText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    color: "#4169e1",
    fontWeight: "bold",
  },
  signInText: {
    fontSize: 30,
    textAlign: "center",
  },
  labelText: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0, 
    marginBottom: 30,
  },
  signInInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "black",
    borderBottomWidth: 0, 
    outlineStyle: "none", 
  },
  iconStyle: {
    marginRight: 10,
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
  signupLink: {
    fontSize: 12,
    textAlign: "center",
  },
  signupText: {
    color: "#4169e1",
    fontWeight: "bold",
  },
  errorText: {
    color: "#e74c3c", 
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
});

export default SignIn;
