import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from "react-native";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const KiemDuyetTro = ({ navigation }) => {
  const [tros, setTros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTros, setFilteredTros] = useState([]);
  const [filtering, setFiltering] = useState(false);

  // Hàm lấy danh sách trọ
  const fetchTros = () => {
    axios.get("https://toquocbinh2102.pythonanywhere.com/tros/")
      .then((response) => {
        setTros(response.data);
        setFilteredTros(response.data);  // Cập nhật lại danh sách trọ khi có dữ liệu mới
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu trọ:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTros(); // Lần đầu tải dữ liệu trọ
  }, []);

  // Sử dụng useFocusEffect để reload dữ liệu khi quay lại trang này
  useFocusEffect(
    React.useCallback(() => {
      fetchTros(); // Gọi lại hàm tải lại dữ liệu trọ mỗi khi quay lại trang này
    }, [])
  );

  const handleFilter = () => {
    if (filtering) {
      setFilteredTros(tros); // Nếu đang lọc, reset lại toàn bộ trọ
    } else {
      setFilteredTros(tros.filter(item => !item.active)); // Lọc trọ đang chờ duyệt
    }
    setFiltering(!filtering); // Đổi trạng thái lọc
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.troItem}
      onPress={() => navigation.navigate("ChiTietTro", { troId: item.id })}
    >
      <View style={styles.troHeader}>
        <Text style={styles.troName}>{item.tenTro}</Text>
        {/* Gắn tag trạng thái */}
        <Text style={[styles.statusTag, item.active ? styles.approved : styles.pending]}>
          {item.active ? "Đã duyệt" : "Đang chờ duyệt"}
        </Text>
      </View>
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

  return (
    <View style={styles.container}>
      {/* Nút lọc */}
      <Button title={filtering ? "Hiển thị tất cả" : "Hiển thị trọ đang chờ duyệt"} onPress={handleFilter} />

      {filteredTros.length === 0 ? (
        <View style={styles.container}>
          <Text>Không có trọ nào.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTros}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
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
  troHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  troName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0288d1",
  },
  statusTag: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: "#fff",
  },
  approved: {
    backgroundColor: "#4CAF50", // Màu xanh lá
  },
  pending: {
    backgroundColor: "#2196F3", // Màu xanh dương
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
