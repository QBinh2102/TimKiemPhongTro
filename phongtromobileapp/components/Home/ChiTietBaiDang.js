import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert, TouchableOpacity, Image } from "react-native";
import { Avatar } from "react-native-elements";
import { Subheading } from "react-native-paper";
import Modal from "react-native-modal";  // Import modal từ react-native-modal
import { MyUserContext } from "../../configs/MyUserContext";
import axios from 'axios';
import { useFocusEffect } from "@react-navigation/native";

const ChiTietBaiDang = ({ route, navigation }) => {
  const userLogin = useContext(MyUserContext);
  const { baiDang } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);
  const [postOwner, setPostOwner] = useState(null);
  const [tro, setTro] = useState(null);  // State để lưu thông tin trọ
  const [images, setImages] = useState([]);  // State để lưu danh sách ảnh
  const [isModalVisible, setIsModalVisible] = useState(false); // State để quản lý trạng thái modal
  const [selectedImage, setSelectedImage] = useState(null); // State lưu ảnh được chọn
  const [findRoomInfo, setFindRoomInfo] = useState(null);  // State để lưu thông tin bài đăng tìm phòng

  const [cities, setCities] = useState([]);       // State lưu danh sách thành phố
  const [districts, setDistricts] = useState([]);   // State lưu danh sách quận
  const [wards, setWards] = useState([]);           // State lưu danh sách phường

  // Lấy danh sách thành phố
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("https://toquocbinh2102.pythonanywhere.com/api/address/cities");
        // console.log(response.data);  // Kiểm tra dữ liệu thành phố
        setCities(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thành phố:", error);
      }
    };
    fetchCities();
  }, []);

  // Lấy danh sách quận khi có thành phố
  useEffect(() => {
    if (findRoomInfo && findRoomInfo.thanh_pho) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(`https://toquocbinh2102.pythonanywhere.com/api/address/city/${findRoomInfo.thanh_pho}`);
          // console.log(response.data);  // Kiểm tra dữ liệu quận
          setDistricts(response.data.districts);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách quận:", error);
        }
      };
      fetchDistricts();
    }
  }, [findRoomInfo?.thanh_pho]);

  // Lấy danh sách phường khi có quận
  useEffect(() => {
    if (findRoomInfo && findRoomInfo.quan) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(`https://toquocbinh2102.pythonanywhere.com/api/address/district/${findRoomInfo.quan}`);
          // console.log(response.data);  // Kiểm tra dữ liệu phường
          setWards(response.data.wards);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách phường:", error);
        }
      };
      fetchWards();
    }
  }, [findRoomInfo?.quan]);

  useEffect(() => {
    // Lấy thông tin người đăng bài
    fetch(`https://toquocbinh2102.pythonanywhere.com/users/${baiDang.nguoiDangBai}`)
      .then(response => response.json())
      .then(userData => {
        setPostOwner(userData);

        if (userData.vaiTro === 2) {
          fetch(`https://toquocbinh2102.pythonanywhere.com/baidangchothues/${baiDang.id}/`)
            .then(response => response.json())
            .then(baiDangChoThueData => {
              if (baiDangChoThueData.troChoThue !== null) {
                fetch(`https://toquocbinh2102.pythonanywhere.com/tros/${baiDangChoThueData.troChoThue}`)
                  .then(response => response.json())
                  .then(troData => {
                    setTro(troData);

                    // Lấy ảnh liên quan đến trọ
                    fetch("https://toquocbinh2102.pythonanywhere.com/anhtros/")
                      .then(response => response.json())
                      .then(anhTroData => {
                        const imagesForTro = anhTroData.filter(image => image.tro === baiDangChoThueData.troChoThue);
                        setImages(imagesForTro);  // Lưu danh sách ảnh vào state
                      })
                      .catch(error => console.error("Lỗi khi lấy thông tin ảnh trọ:", error));
                  })
                  .catch(error => console.error("Lỗi khi lấy thông tin trọ:", error));
              }
            })
            .catch(error => console.error("Lỗi khi lấy thông tin bài đăng cho thuê:", error));
        } else if (userData.vaiTro === 3) {
          // Lấy thông tin bài đăng tìm phòng nếu vaiTro = 3
          fetch(`https://toquocbinh2102.pythonanywhere.com/baidangtimphongs/${baiDang.id}/`)
            .then(response => response.json())
            .then(findRoomData => {
              setFindRoomInfo(findRoomData);
            })
            .catch(error => console.error("Lỗi khi lấy thông tin bài đăng tìm phòng:", error));
        }
      })
      .catch(error => console.error("Lỗi khi lấy thông tin người đăng bài:", error));

    // Lấy bình luận
    fetch("https://toquocbinh2102.pythonanywhere.com/binhluans/")
      .then(response => response.json())
      .then(data => {
        const filteredComments = data.filter(comment => comment.baiDang === baiDang.id);
        setComments(filteredComments.reverse());

        const userIds = filteredComments.map(comment => comment.nguoiBinhLuan);
        if (userIds.length > 0) {
          fetch(`https://toquocbinh2102.pythonanywhere.com/users/?ids=${userIds.join(",")}`)
            .then(response => response.json())
            .then(userData => {
              setUsers(userData);
            })
            .catch(error => console.error("Lỗi khi lấy thông tin người dùng:", error));
        }
      })
      .catch(error => console.error("Lỗi khi lấy bình luận:", error));

  }, [baiDang.id, baiDang.nguoiDangBai]);

  const handleCommentSubmit = () => {
    if (newComment.trim() === "") return;

    fetch("https://toquocbinh2102.pythonanywhere.com/binhluans/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        baiDang: baiDang.id,
        thongTin: newComment,
        nguoiBinhLuan: userLogin.id, 
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setComments([data, ...comments].reverse());
        setNewComment("");
      })
      .catch((error) => console.error("Lỗi khi gửi bình luận:", error));
  };

  const getUserInfo = (userId) => {
    return users.find(user => user.id === userId);
  };

  const handleUserPress = (userId) => {
    if (userId === userLogin.id) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("TrangCaNhan", { userId });
    }
  };

  const handleDeletePost = () => {
    Alert.alert(
      "Xóa bài đăng",
      "Bạn có chắc chắn muốn xóa bài đăng này không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          onPress: () => {
            fetch(`https://toquocbinh2102.pythonanywhere.com/baidangs/${baiDang.id}/`, {
              method: "DELETE",
            })
              .then(() => {
                alert("Bài đăng đã được xóa thành công!");
                navigation.goBack();  
              })
              .catch((error) => {
                console.error("Lỗi khi xóa bài đăng:", error);
                alert("Có lỗi xảy ra khi xóa bài đăng.");
              });
          }
        },
      ]
    );
  };

  // Hàm mở modal và chọn ảnh
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  const getCityName = (cityId) => {
    const city = cities.find(city => city.id === cityId);
    return city ? city.name : "Chưa xác định thành phố";  // Trả về một tên mặc định nếu không có cityId
  };

  const getDistrictName = (districtId) => {
    const district = districts.find(district => district.id === districtId);
    return district ? district.name : "Chưa xác định quận";  // Trả về một tên mặc định nếu không có districtId
  };

  const getWardName = (wardId) => {
    const ward = wards.find(ward => ward.id === wardId);
    return ward ? ward.name : "Chưa xác định phường";  // Trả về một tên mặc định nếu không có wardId
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postHeader}>
        {postOwner && (
          <Avatar 
            rounded 
            size="medium" 
            source={postOwner.image ? { uri: `https://toquocbinh2102.pythonanywhere.com${postOwner.image}` } : null}
            containerStyle={styles.avatar}
          />
        )}
        <View style={styles.postInfo}>
          {postOwner && (
            <Text 
              style={styles.username}
              onPress={() => handleUserPress(postOwner.id)} 
            >
              {postOwner.last_name} {postOwner.first_name}
            </Text>
          )}
          <Text style={styles.date}>{new Date(baiDang.created_date).toLocaleString("vi-VN")}</Text>
        </View>
       
        {baiDang.nguoiDangBai === userLogin.id && (
          <TouchableOpacity onPress={handleDeletePost} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentBox}>
        <Subheading style={styles.subtitle}>{baiDang.tieuDe}</Subheading>
        <Text style={styles.content}>{baiDang.thongTin}</Text>
      </View>
      
{tro && (
  <View style={styles.troDetails}>
    <View style={styles.troTitleContainer}>
      <Text style={styles.troTitle}>Chi tiết trọ cho thuê</Text>
      {/* Nút Xem chi tiết nằm bên phải */}
      <TouchableOpacity 
        style={styles.detailButton} 
        onPress={() => navigation.navigate("ChiTietTro", { troId: tro.id })}  // Điều hướng đến màn hình ChiTietTro
      >
        <Text style={styles.detailButtonText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.troInfo}>Địa chỉ: {tro.diaChi}</Text>
    <Text style={styles.troInfo}>Giá: {tro.gia} VND</Text>
    <Text style={styles.troInfo}>Số người ở: {tro.soNguoiO}</Text>
  </View>
)}



      {/* Hiển thị thông tin bài đăng tìm phòng nếu vai trò là 3 */}
      {findRoomInfo && (
        <View style={styles.troDetails}>
          <Text style={styles.troTitle}>Khu vực tìm phòng</Text>
          {findRoomInfo.thanh_pho && <Text style={styles.troInfo}>Tỉnh/Thành phố: {getCityName(findRoomInfo.thanh_pho)}</Text>}
          {findRoomInfo.quan && <Text style={styles.troInfo}>Quận: {getDistrictName(findRoomInfo.quan)}</Text>}
          {findRoomInfo.phuong && <Text style={styles.troInfo}>Phường: {getWardName(findRoomInfo.phuong)}</Text>}
        </View>
      )}

      {/* Hiển thị ảnh liên quan đến trọ */}
      {images.length > 0 && (
        <View style={styles.imageGallery}>
          {images.map((image) => (
            <TouchableOpacity key={image.id} onPress={() => openModal(image.anh)}>
              <Image
                source={{ uri: image.anh }}
                style={styles.image}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal hiển thị ảnh khi người dùng nhấn vào ảnh */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
          />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          placeholder="Nhập bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Gửi" onPress={handleCommentSubmit} />
      </View>

      <Text style={styles.commentListTitle}>Danh sách bình luận:</Text>
      <View style={styles.commentList}>
        {comments.length > 0 ? (
          comments.map((comment) => {
            const user = getUserInfo(comment.nguoiBinhLuan); 
            return (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Avatar 
                    rounded 
                    size="small" 
                    source={user && user.image ? { uri: `https://toquocbinh2102.pythonanywhere.com${user.image}` } : null} 
                    containerStyle={styles.commentAvatar}
                  />
                  <Text 
                    style={styles.commentUser}
                    onPress={() => handleUserPress(user.id)} 
                  >
                    {user ? `${user.last_name} ${user.first_name}` : "Unknown"}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.thongTin}</Text>
                <Text style={styles.commentDate}>{new Date(comment.created_date).toLocaleString("vi-VN")}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noComments}>Chưa có bình luận nào.</Text>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  avatar: {
    marginRight: 10,
  },
  postInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  contentBox: {
    backgroundColor: "#e0f7fa",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0288d1",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0288d1",
  },
  content: {
    fontSize: 16,
    marginTop: 10,
    lineHeight: 22,
    color: "#333",
  },
  commentSection: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
    flex: 1,
    paddingHorizontal: 10,
  },
  commentList: {
    marginTop: 20,
  },
  commentListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  commentItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  commentAvatar: {
    marginRight: 10,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#0288d1",
  },
  commentContent: {
    fontSize: 14,
    marginTop: 5,
  },
  commentDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  noComments: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  troDetails: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0288d1",
    marginTop: 20,
  },
  troTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  // Để tiêu đề và nút cách nhau
    alignItems: 'center',
  },
  troTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0288d1",
  },
  detailButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f44336",  // Màu đỏ nổi bật
    borderRadius: 5,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  troInfo: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
  },

  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  fullImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#0288d1",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChiTietBaiDang;