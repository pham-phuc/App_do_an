import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FooterList from "../components/footer/FooterList";
import axios from "axios";
import { LineChart, BarChart } from "react-native-chart-kit";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_ENDPOINTS } from "../apiConfig";

const Home = () => {
  const [energyData, setEnergyData] = useState([]);
  const [currentEnergy, setCurrentEnergy] = useState([]);
  const [monthlyEnergyData, setMonthlyEnergyData] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
    backgroundColor: "#ADD8E6",  
    backgroundGradientFrom: "#ADD8E6",
    backgroundGradientTo: "#ADD8E6",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 6,
    },
    propsForDots: {
      r: "3",
      strokeWidth: "3",
      stroke: "#ffa502",
      fill: "#ffa502",
    },
    barPercentage: 0.6,
  };

  function calculateBill(kWh) {
    const rates = [
      { limit: 50, price: 1728 },
      { limit: 100, price: 1786 },
      { limit: 200, price: 2074 },
      { limit: 300, price: 2612 },
      { limit: 400, price: 2919 },
      { limit: Infinity, price: 3015 },
    ];

    let totalCost = 0;
    let remainingkWh = kWh;

    for (let i = 0; i < rates.length; i++) {
      let currentLimit =
        i === 0 ? rates[i].limit : rates[i].limit - rates[i - 1].limit;

      if (remainingkWh > currentLimit) {
        totalCost += currentLimit * rates[i].price;
        remainingkWh -= currentLimit;
      } else {
        totalCost += remainingkWh * rates[i].price;
        break;
      }
    }
    return totalCost;
  }

  function formatNumber(number) {
    let numberStr = number.toString();
    let formattedStr = "";

    for (let i = numberStr.length - 1, count = 1; i >= 0; i--, count++) {
      formattedStr = numberStr[i] + formattedStr;
      if (count % 3 === 0 && i !== 0) {
        formattedStr = "." + formattedStr;
      }
    }
    return formattedStr;
  }

  useEffect(() => {
    fetchEnergy();
  }, []);

  const fetchEnergy = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.GET_ENERGY);
      const energyValues1 = data.slice(-8).map((item) => item.energy1);
      const energyValues2 = data.slice(-8).map((item) => item.energy2);
      for (let i = 0; i < energyValues1.length; i++)
        energyValues1[i] += energyValues2[i];
      const current = energyValues1[energyValues1.length - 1];
      setCurrentEnergy(current);
      setEnergyData(energyValues1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMonthlyEnergy();
  }, []);

  const fetchMonthlyEnergy = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.GET_MONTHLY_ENERGY);
      const monthlyEnergyValues1 = data
        .slice(-12)
        .map((item) => item.energyMonth1);
      const monthlyEnergyValues2 = data
        .slice(-12)
        .map((item) => item.energyMonth2);
      for (let i = 0; i < monthlyEnergyValues1.length; i++)
        monthlyEnergyValues1[i] += monthlyEnergyValues2[i];
      setMonthlyEnergyData(monthlyEnergyValues1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.mainText}>Current Energy</Text>
          {energyData.length ? (
            <LineChart
              data={{
                labels: [
                  "0:00",
                  "3:00",
                  "6:00",
                  "9:00",
                  "12:00",
                  "15:00",
                  "18:00",
                  "21:00",
                ],
                datasets: [
                  {
                    data: energyData,
                  },
                ],
              }}
              width={screenWidth - 6}
              height={290}
              yAxisSuffix=" kWh"
              yAxisInterval={1}
              chartConfig={chartConfig}
              fromZero={true}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 6,
              }}
            />
          ) : (
            <Text>Loading</Text>
          )}
        </View>
        <View style={{ margin: 5 }}>
          <Text>
            - Energy cost of this month:{" "}
            {formatNumber(Math.round(calculateBill(currentEnergy)))} VND
          </Text>
        </View>
        <View>
          <Text style={styles.mainText}>Monthly Energy</Text>
          {monthlyEnergyData.length ? (
            <BarChart
              data={{
                labels: [
                  "Jan", 
                  "Feb", 
                  "Mar", 
                  "Apr", 
                  "May", 
                  "Jun", 
                  "Jul",
                  "Aug", 
                  "Sep", 
                  "Oct", 
                  "Nov", 
                  "Dec", 
                ],
                datasets: [
                  {
                    data: monthlyEnergyData,
                  },
                ],
              }}
              width={screenWidth - 6}
              height={290}
              yAxisSuffix=" kWh"
              chartConfig={chartConfig}
              fromZero={true}
              style={{
                borderRadius: 6,
                marginVertical: 8,
              }}
            />
          ) : (
            <Text>Loading</Text>
          )}
        </View>
      </ScrollView>
      <FooterList />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 3,
  },
  mainText: {
    fontSize: 30,
    textAlign: "center",
    marginTop: 5,
    textTransform: "uppercase",
  },
});

export default Home;