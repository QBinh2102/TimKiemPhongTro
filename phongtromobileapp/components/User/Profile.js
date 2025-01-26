import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import MyStyles from "../../styles/MyStyles";
import { Button, IconButton, Menu, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const Profile = ({ route, navigation }) => {
  const user = useContext(MyUserContext);
  const [userPosts, setUserPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const dispatch = useContext(MyDispatchContext);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "logout" });
  };

  const getVaiTroName = (vaiTro) => {
    switch (vaiTro) {
      case 1: return "Quản trị viên";
      case 2: return "Chủ nhà trọ";
      case 3: return "Người thuê trọ";
      default: return "Chưa xác định";
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

 
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("https://toquocbinh2102.pythonanywhere.com/api/address/cities");
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

 
  useEffect(() => {
    if (selectedCity) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(`https://toquocbinh2102.pythonanywhere.com/api/address/city/${selectedCity}`);
          setDistricts(response.data.districts || []);
        } catch (error) {
          setDistricts([]);
        }
      };
      fetchDistricts();
    }
  }, [selectedCity]);

 
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(`https://toquocbinh2102.pythonanywhere.com/api/address/district/${selectedDistrict}`);
          setWards(response.data.wards || []);
        } catch (error) {
          setWards([]);
        }
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (user) {
      fetch("https://toquocbinh2102.pythonanywhere.com/baidangs/")
        .then((response) => response.json())
        .then((data) => {
          const filteredPosts = data.filter(post => post.nguoiDangBai === user.id);
          const sortedPosts = filteredPosts.sort((b, a) => new Date(b.created_date) - new Date(a.created_date));
          setUserPosts(sortedPosts);
        })
        .catch((error) => console.error("Error fetching user posts:", error));
    }
  }, [user]);

  const handleAddPost = async () => {
   
  
  
    try {
      
      const formData = new FormData();
  
      
      formData.append('tieuDe', newPostTitle);
      formData.append('thongTin', newPostContent);
      formData.append('nguoiDangBai', user.id); 
      formData.append('thanh_pho', selectedCity);  
      formData.append('quan', selectedDistrict); 
      formData.append('phuong', selectedWard); 

  
     
      // console.log("Form data bài đăng đã được tạo:", formData);
  
   
      const response = await axios.post("https://toquocbinh2102.pythonanywhere.com/baidangtimphongs/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
  
      
      if (response.data) {
        alert("Bài đăng đã được tạo thành công!");
        setUserPosts((prevPosts) => [response.data, ...prevPosts]);
    
        setNewPostTitle("");
        setNewPostContent("");
        setSelectedCity(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
      
      }
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      alert("Đã có lỗi xảy ra khi đăng bài. Vui lòng thử lại.");
    }
  };
  
  

  const [visible, setVisible] = useState(false); 
  const showMenu = () => setVisible(true); 
  const hideMenu = () => setVisible(false); 

  return (
    <Provider>
      <ScrollView style={styles.container}>
        {user ? (
          <>
            <View style={styles.profileHeader}>
              <Image
                source={user.image ? { uri: `https://toquocbinh2102.pythonanywhere.com${user.image}` } : null}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user.last_name} {user.first_name}
                </Text>
                <Text style={styles.profileUsername}>@{user.username}</Text>
              </View>
              <Menu
                visible={visible}
                onDismiss={hideMenu}
                anchor={<IconButton icon="dots-vertical" size={24} onPress={showMenu} />}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <Menu.Item onPress={logout} title="Đăng xuất" />
              </Menu>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Thông tin liên hệ</Text>
              <Text style={styles.contactText}>Số điện thoại: {user.SDT}</Text>
              <Text style={styles.contactText}>Email: {user.email}</Text>
              <Text style={styles.contactText}>Vai trò: {getVaiTroName(user.vaiTro)}</Text>
              <Text style={styles.contactText}>Ngày tham gia: {formatDate(user.date_joined)}</Text>
            </View>

            {user.vaiTro === 1 && (
              <View style={styles.manageTroContainer}>
                <Button mode="contained" onPress={() => navigation.navigate('KiemDuyetTro')}>
                  Kiểm duyệt trọ
                </Button>
              </View>
            )}

            {user.vaiTro === 2 && (
              <View style={styles.manageTroContainer}>
                <Button mode="contained" onPress={() => navigation.navigate('QuanLyTro')}>
                  Quản lý trọ
                </Button>
              </View>
            )}
            {user.vaiTro === 3 && (
              <View style={styles.addPostForm}>
                {/* Dropdown for City */}
                <View style={styles.input}>
                  <Text>Chọn Tỉnh/Thành phố:</Text>
                  <Picker
                    selectedValue={selectedCity}
                    onValueChange={(itemValue) => setSelectedCity(itemValue)}
                  >
                    {cities.map((city) => (
                      <Picker.Item key={city.id} label={city.name} value={city.id} />
                    ))}
                  </Picker>
                </View>

                {/* Dropdown for District */}
                <View style={styles.input}>
                  <Text>Chọn Quận/Huyện:</Text>
                  <Picker
                    selectedValue={selectedDistrict}
                    onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
                    enabled={selectedCity !== null}
                  >
                    {districts.map((district) => (
                      <Picker.Item key={district.id} label={district.name} value={district.id} />
                    ))}
                  </Picker>
                </View>

                {/* Dropdown for Ward */}
                <View style={styles.input}>
                  <Text>Chọn Xã/Phường/Thị trấn:</Text>
                  <Picker
                    selectedValue={selectedWard}
                    onValueChange={(itemValue) => setSelectedWard(itemValue)}
                    enabled={selectedDistrict !== null}
                  >
                    {wards.map((ward) => (
                      <Picker.Item key={ward.id} label={ward.name} value={ward.id} />
                    ))}
                  </Picker>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Tiêu đề bài đăng"
                  value={newPostTitle}
                  onChangeText={setNewPostTitle}
                />
                <TextInput
                  style={styles.textArea}
                  placeholder="Nội dung bài đăng"
                  value={newPostContent}
                  onChangeText={setNewPostContent}
                  multiline
                />
                <Button mode="contained" onPress={handleAddPost}>Đăng bài tìm phòng</Button>
              </View>
            )}

            <Text style={styles.postsTitle}>Bài viết của {user.first_name}:</Text>
            {userPosts.length > 0 ? (
              userPosts.slice().reverse().map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postItem}
                  onPress={() => navigation.navigate('ChiTietBaiDang', { baiDang: post })}
                >
                  <Text style={styles.postTitle}>{post.tieuDe}</Text>
                  <Text style={styles.postDate}>
                    Ngày đăng: {new Date(post.created_date).toLocaleString("vi-VN")}
                  </Text>
                  <Text style={styles.postInfo}>{post.thongTin.replace(/<[^>]+>/g, '')}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noPostsText}>Người dùng này chưa đăng bài viết nào.</Text>
            )}
          </>
        ) : (
          <Text>Đang tải thông tin người dùng...</Text>
        )}
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#0288d1",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileUsername: {
    fontSize: 16,
    color: "#0288d1",
    marginTop: 5,
  },
  contactInfo: {
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0288d1",
  },
  contactText: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  manageTroContainer: {
    marginTop: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#0288d1",
  },
  addPostForm: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    height: 100,
  },
  postItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    paddingTop: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0288d1",
  },
  postDate: {
    fontSize: 14,
    color: "#888",
  },
  postInfo: {
    fontSize: 14,
    color: "#555",
  },
  noPostsText: {
    color: "#888",
    fontStyle: "italic",
    marginTop: 20,
  },
});

export default Profile;
