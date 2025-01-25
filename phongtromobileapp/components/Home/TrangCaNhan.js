import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Button } from "react-native";
import { MyUserContext, MyDispatchContext } from "../../configs/MyUserContext";  
import axios from "axios";

const TrangCaNhan = ({ route, navigation }) => {
  const { userId } = route.params;
  const userLogin = useContext(MyUserContext);  
  const dispatch = useContext(MyDispatchContext); 
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);


  const getVaiTroName = (vaiTro) => {
    if (vaiTro === 1) return "Quản trị viên";
    else if (vaiTro === 2) return "Chủ nhà trọ";
    else if (vaiTro === 3) return "Người thuê trọ";
  };

  
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetch(`https://toquocbinh2102.pythonanywhere.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setIsFollowing(userLogin.tuongTac.includes(data.id));  
      })
      .catch((error) => console.error("Error fetching user data:", error));

    fetch(`https://toquocbinh2102.pythonanywhere.com/baidangs/`)
      .then((response) => response.json())
      .then((data) => {
        const filteredPosts = data.filter(post => post.nguoiDangBai === userId);
        setUserPosts(filteredPosts);
      })
      .catch((error) => console.error("Error fetching user posts:", error));
  }, [userId, userLogin.tuongTac]);

  const handleFollow = () => {
    const updatedTuongTac = [...userLogin.tuongTac, userId];  
    console.info(updatedTuongTac)
    
    const formData = new FormData();
  
   
    updatedTuongTac.forEach(id => formData.append('tuongTac', id));

    console.info(formData);

    axios.patch(`https://toquocbinh2102.pythonanywhere.com/users/${userLogin.id}/`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer yourAccessToken`,
        },
      }
    )
    .then((response) => {
      console.log("Cập nhật thành công:", response.data);
    })
    .catch((error) => {
      console.error("Lỗi khi cập nhật:", error);
    });
  };
  
  const handleUnfollow = () => {
    const updatedTuongTac = userLogin.tuongTac.filter(item => item !== userId);  
  
    fetch(`https://toquocbinh2102.pythonanywhere.com/users/${userLogin.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userLogin.token}`,
      },
      body: JSON.stringify({
        tuongTac: updatedTuongTac,
      }),
    })
      .then(response => response.json())
      .then(() => {
    
        dispatch({ type: 'UPDATE_TUONGTAC', payload: updatedTuongTac });
  
        
        console.log("Updated tuongTac in context:", updatedTuongTac);
  
        setIsFollowing(false);
      })
      .catch(error => console.error("Error unfollowing user:", error));
  };
  
  return (
    <ScrollView style={styles.container}>
      {userData ? (
        <>
          <View style={styles.profileHeader}>
            <Image
              source={userData.image ? { uri: `https://toquocbinh2102.pythonanywhere.com${userData.image}` } : null}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userData.last_name} {userData.first_name}
              </Text>
              <Text style={styles.profileUsername}>@{userData.username}</Text>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Thông tin liên hệ</Text>
            <Text style={styles.contactText}>Số điện thoại: {userData.SDT}</Text>
            <Text style={styles.contactText}>Email: {userData.email}</Text>
            <Text style={styles.contactText}>Vai trò: {getVaiTroName(userData.vaiTro)}</Text>
            <Text style={styles.contactText}>Ngày tham gia: {formatDate(userData.date_joined)}</Text>
          </View>

       
          {userLogin.id !== userId && (
            <View style={styles.followButtonContainer}>
              {isFollowing ? (
                <Button title="Hủy theo dõi" onPress={handleUnfollow} color="#d32f2f" />
              ) : (
                <Button title="Theo dõi" onPress={handleFollow} color="#0288d1" />
              )}
            </View>
          )}

          <Text style={styles.postsTitle}>Bài viết của {userData.first_name}:</Text>

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
                <View style={styles.postContent}>
                  <Text style={styles.postInfo}>{post.thongTin.replace(/<[^>]+>/g, '')}</Text>
                </View>
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
    alignItems: "center",
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
  postsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#0288d1",
  },
  postItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  postContent: {
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  postInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
    lineHeight: 20,
  },
  postDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  noPostsText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  followButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default TrangCaNhan;
