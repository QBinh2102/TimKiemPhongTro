import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import axios from 'axios';

const KiemDuyetTro = ({ navigation }) => {
  const [tros, setTros] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    axios.get("https://toquocbinh2102.pythonanywhere.com/tros/")
      .then((response) => {
        setTros(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu trọ:", error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.troItem}
      onPress={() => navigation.navigate("ChiTietTro", { troId: item.id })} 
    >
      <Text style={styles.troName}>{item.tenTro}</Text>
      <Text style={styles.troLocation}>Địa chỉ: {item.diaChi}</Text>
      <Text style={styles.troPrice}>Giá: {item.gia.toLocaleString()} VND</Text>
      <Text style={styles.troPeople}>Số người ở: {item.soNguoiO}</Text>
    </TouchableOpacity>
  );
  

 
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

 
  if (tros.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Không có trọ nào.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tros}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  troItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  troName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0288d1",
  },
  troLocation: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  troPrice: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  troPeople: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
});

export default KiemDuyetTro;
