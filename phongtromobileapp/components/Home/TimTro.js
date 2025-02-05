import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MyUserContext } from '../../configs/MyUserContext';

const TimTro = ({ navigation }) => {
  const userLogin = useContext(MyUserContext);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(null);
  const [troList, setTroList] = useState([]);

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
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
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
          console.error("Error fetching wards:", error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const handleSearch = async () => {
    let url = "https://toquocbinh2102.pythonanywhere.com/tros/";
    const params = {};

    if (selectedCity) params.thanh_pho = selectedCity;
    if (selectedDistrict) params.quan = selectedDistrict;
    if (selectedWard) params.phuong = selectedWard;
    if (selectedPrice) params.gia = selectedPrice;
    if (selectedPeople) params.soNguoiO = selectedPeople;

    try {
      const response = await axios.get(url, { params });

      const filteredTroList = response.data.filter(tro => {
        return (
          (selectedCity ? tro.thanh_pho === selectedCity : true) &&
          (selectedDistrict ? tro.quan === selectedDistrict : true) &&
          (selectedWard ? tro.phuong === selectedWard : true) &&
          (selectedPrice ? filterByPrice(tro.gia, selectedPrice) : true) &&
          (selectedPeople ? filterByPeople(tro.soNguoiO, selectedPeople) : true) &&
          tro.active === true
        );
      });

      if (filteredTroList.length > 0) {
        setTroList(filteredTroList);
      } else {
        setTroList([]);
      }
    } catch (error) {
      console.error("Error fetching trọ:", error);
      setTroList([]);
    }
  };

  const filterByPrice = (price, filter) => {
    switch (filter) {
      case "under_1M":
        return price < 1000000;
      case "1M_2M":
        return price >= 1000000 && price <= 2000000;
      case "2M_3M":
        return price >= 2000000 && price <= 3000000;
      case "3M_5M":
        return price >= 3000000 && price <= 5000000;
      case "over_5M":
        return price >= 5000000;
      default:
        return true;
    }
  };

  const filterByPeople = (people, filter) => {
    switch (filter) {
      case "1":
        return people === 1;
      case "2":
        return people === 2;
      case "3":
        return people === 3;
      case "4plus":
        return people >= 4;
      default:
        return true;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tìm Trọ</Text>

      <Text style={styles.label}>Chọn Tỉnh / Thành phố</Text>
      <Picker
        selectedValue={selectedCity}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
      >
        <Picker.Item label="Chọn Tỉnh / Thành phố" value={null} />
        {cities.map((city) => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Chọn Quận / Huyện</Text>
      <Picker
        selectedValue={selectedDistrict}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
      >
        <Picker.Item label="Chọn Quận / Huyện" value={null} />
        {districts.map((district) => (
          <Picker.Item key={district.id} label={district.name} value={district.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Chọn Xã / Phường</Text>
      <Picker
        selectedValue={selectedWard}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedWard(itemValue)}
      >
        <Picker.Item label="Chọn Xã / Phường" value={null} />
        {wards.map((ward) => (
          <Picker.Item key={ward.id} label={ward.name} value={ward.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Chọn Giá Tiền</Text>
      <Picker
        selectedValue={selectedPrice}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedPrice(itemValue)}
      >
        <Picker.Item label="Tất cả" value={null} />
        <Picker.Item label="Dưới 1 triệu" value="under_1M" />
        <Picker.Item label="Từ 1 triệu đến 2 triệu" value="1M_2M" />
        <Picker.Item label="Từ 2 triệu đến 3 triệu" value="2M_3M" />
        <Picker.Item label="Từ 3 triệu đến 5 triệu" value="3M_5M" />
        <Picker.Item label="Từ 5 triệu trở lên" value="over_5M" />
      </Picker>

      <Text style={styles.label}>Chọn Số Người Ở</Text>
      <Picker
        selectedValue={selectedPeople}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedPeople(itemValue)}
      >
        <Picker.Item label="Tất cả" value={null} />
        <Picker.Item label="1 người" value="1" />
        <Picker.Item label="2 người" value="2" />
        <Picker.Item label="3 người" value="3" />
        <Picker.Item label="Từ 4 người trở lên" value="4plus" />
      </Picker>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm Trọ</Text>
      </TouchableOpacity>

      <ScrollView style={styles.resultContainer}>
        {troList.length > 0 ? (
          troList.map((tro) => (
            <TouchableOpacity
              key={tro.id}
              style={styles.troItem}
              onPress={() => navigation.navigate("ChiTietTro", { troId: tro.id })}
            >
              <Text style={styles.troName}>{tro.tenTro}</Text>
              <Text>Địa chỉ: {tro.diaChi}</Text>
              <Text style={styles.soNguoiO}>Số người ở: {tro.soNguoiO}</Text>
              <Text style={styles.gia}>Giá: {tro.gia} VND</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>Không có kết quả tìm kiếm</Text>
        )}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0288d1',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  picker: {
    height: 60,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#0288d1',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
  },
  troItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  troName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288d1',
  },
  soNguoiO: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  gia: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default TimTro;
