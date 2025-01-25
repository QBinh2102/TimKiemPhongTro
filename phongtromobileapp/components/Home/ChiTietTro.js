import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert, Image, ScrollView, Modal, TouchableOpacity } from "react-native";
import axios from 'axios';

const ChiTietTro = ({ route, navigation }) => {
  const { troId } = route.params;
  const [tro, setTro] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [images, setImages] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null); 


  useEffect(() => {
    axios.get(`https://toquocbinh2102.pythonanywhere.com/tros/${troId}/`)
      .then(response => {
        setTro(response.data);
        setSelectedCity(response.data.thanh_pho);
        setSelectedDistrict(response.data.quan);
        setSelectedWard(response.data.phuong);
      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin trọ", error);
        alert("Đã có lỗi xảy ra.");
      });
  }, [troId]);

 
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
          setDistricts(response.data.districts);
        } catch (error) {
          console.error("Error fetching districts:", error);
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
          setWards(response.data.wards);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };

      fetchWards();
    }
  }, [selectedDistrict]);

 
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("https://toquocbinh2102.pythonanywhere.com/anhtros/");
        const filteredImages = response.data.filter(image => image.tro === troId); 
        setImages(filteredImages);
      } catch (error) {
        console.error("Lỗi khi lấy ảnh", error);
        alert("Đã có lỗi xảy ra khi lấy ảnh.");
      }
    };

    fetchImages();
  }, [troId]);

  
  const handleDelete = () => {
    Alert.alert(
      "Xóa trọ",
      "Bạn có chắc muốn xóa trọ này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa", onPress: () => {
            axios.delete(`https://toquocbinh2102.pythonanywhere.com/tros/${troId}/`)
              .then(() => {
                alert("Xóa trọ thành công!");
                navigation.goBack();  // Quay lại trang quản lý trọ
              })
              .catch(error => {
                console.error("Lỗi khi xóa trọ", error);
                alert("Đã có lỗi xảy ra khi xóa trọ.");
              });
          }
        },
      ]
    );
  };

  
  const getCityName = (cityId) => cities.find(city => city.id === cityId)?.name || '';
  const getDistrictName = (districtId) => districts.find(district => district.id === districtId)?.name || '';
  const getWardName = (wardId) => wards.find(ward => ward.id === wardId)?.name || '';

  
  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true); 
  };


  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  if (!tro) {
    return <Text>Đang tải thông tin trọ...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi Tiết Trọ</Text>

      <Text style={styles.label}>Tên Trọ:</Text>
      <Text style={styles.info}>{tro.tenTro}</Text>

      <Text style={styles.label}>Địa Chỉ:</Text>
      <Text style={styles.info}>{tro.diaChi}</Text>

      <Text style={styles.label}>Giá:</Text>
      <Text style={styles.info}>{tro.gia} VND</Text>

      <Text style={styles.label}>Số Người Ở:</Text>
      <Text style={styles.info}>{tro.soNguoiO}</Text>

      <Text style={styles.label}>Thành phố:</Text>
      <Text style={styles.info}>{getCityName(selectedCity)}</Text>

      <Text style={styles.label}>Quận:</Text>
      <Text style={styles.info}>{getDistrictName(selectedDistrict)}</Text>

      <Text style={styles.label}>Phường:</Text>
      <Text style={styles.info}>{getWardName(selectedWard)}</Text>

   
      <Text style={styles.imageTitle}>Ảnh của Trọ</Text>
      <ScrollView horizontal style={styles.imageContainer}>
        {images.length === 0 ? (
          <Text>Không có ảnh</Text>
        ) : (
          images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(image.anh)}>
              <Image
                source={{ uri: image.anh }}  // Đảm bảo URL ảnh là chính xác
                style={styles.image}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

 
      <Button title="Xóa trọ" color="red" onPress={handleDelete} />

    
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0288d1",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",  
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff0000",
    padding: 5,
    borderRadius: 50,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default ChiTietTro;
