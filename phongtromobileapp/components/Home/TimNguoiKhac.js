import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native"; // Để sử dụng navigation

const TimNguoiKhac = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Dữ liệu tìm kiếm
  const [filteredUsers, setFilteredUsers] = useState([]); // Danh sách người dùng đã lọc
  const [users, setUsers] = useState([]); // Dữ liệu người dùng từ API
  const navigation = useNavigation(); // Khai báo navigation

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://toquocbinh2102.pythonanywhere.com/users/");
        const data = await response.json();
        setUsers(data); // Lưu dữ liệu người dùng vào state
        setFilteredUsers(data); // Mặc định, hiển thị tất cả người dùng
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Chỉ chạy một lần khi component được render lần đầu

  // Hàm tìm kiếm người dùng theo username
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
    setFilteredUsers(filtered);
  };

  // Hàm khi người dùng bấm vào một người dùng trong danh sách
  const handleUserPress = (userId) => {
    navigation.navigate("TrangCaNhan", { userId }); // Điều hướng sang TrangCaNhan với userId
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm theo username"
        value={searchQuery}
        onChangeText={handleSearch} // Gọi hàm tìm kiếm khi thay đổi văn bản
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem bottomDivider onPress={() => handleUserPress(item.id)}>
            {/* Hiển thị avatar nếu có */}
            <Avatar 
              rounded 
              size="medium" 
              source={{ uri: item.image ? `https://toquocbinh2102.pythonanywhere.com${item.image}` : "https://cbam.edu.vn/wp-content/uploads/2024/10/avatar-mac-dinh-30xJKPDu.jpg" }} 
            />
            <ListItem.Content>
              <Text>{item.first_name} {item.last_name}</Text>
              <Text>{item.username}</Text>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
});

export default TimNguoiKhac;
