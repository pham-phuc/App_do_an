import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/auth";
import { API_ENDPOINTS } from "../apiConfig";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [state, setState] = useContext(AuthContext);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async () => {
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      alert('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const res = await axios.post(API_ENDPOINTS.SIGNUP, { name, email, password });
    if (res.data.error) {
      alert(res.data.error);
    } else {
      const userData = { ...res.data, password };
      setState(userData);
      await AsyncStorage.setItem('auth-rn', JSON.stringify(userData));
      alert("Sign Up Successful");
      navigation.navigate('Home');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={{ marginVertical: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/logo.png')} style={styles.imageStyle} />
        </View>
        <Text style={styles.signupText}>Sign Up</Text>

        {/* Name Input */}
        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.labelText}>NAME</Text>
          <View style={styles.inputWrapper}>
            <Icon name="account" size={20} color="gray" style={styles.iconStyle} />
            <TextInput
              style={styles.signupInput}
              value={name}
              onChangeText={text => setName(text)}
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="Enter your name here"
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.labelText}>EMAIL</Text>
          <View style={styles.inputWrapper}>
            <Icon name="email" size={20} color="gray" style={styles.iconStyle} />
            <TextInput
              style={styles.signupInput}
              value={email}
              onChangeText={text => setEmail(text)}
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
              style={styles.signupInput}
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry={!showPassword} 
              autoComplete="password"
              placeholder="Enter your password here"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-off" : "eye"} 
                size={20}
                color="gray"
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        {/* Confirm Password Input */}
        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.labelText}>CONFIRM PASSWORD</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="gray" style={styles.iconStyle} />
            <TextInput
              style={styles.signupInput}
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              secureTextEntry={!showConfirmPassword}
              autoComplete="password"
              placeholder="Confirm your password"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color="gray"
                style={styles.iconStyle}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={styles.signupLink}>
          Already Joined?{" "}
          <Text
            style={styles.signinText}
            onPress={() => navigation.navigate('SignIn')}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 20, 
  },
  signupText: {
    fontSize: 30,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    marginBottom: 30,
  },
  signupInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'black',
    borderBottomWidth: 0,
  },
  iconStyle: {
    marginRight: 10,
  },
  buttonStyle: {
    backgroundColor: '#4169e1',
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    marginHorizontal: 15,
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  signupLink: {
    fontSize: 12,
    textAlign: 'center',
  },
  signinText: {
    color: '#4169e1',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'left',
  },
});

export default SignUp;
