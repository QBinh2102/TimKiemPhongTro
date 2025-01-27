import React, { useState, useEffect, useContext } from "react";
import { MyUserContext } from "../../configs/MyUserContext";
import { View, Text, Alert, TouchableOpacity, Image, Platform, KeyboardAvoidingView } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import APIs, { endpoints } from "../../configs/APIs";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";

const ThayDoiThongTin = () => {
    const nav = useNavigation();
    const userLogin = useContext(MyUserContext);
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        username: "",
        image: "",
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [images, setImages] = useState([]);

    // Lấy thông tin người dùng từ API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userLogin && userLogin.id) {
                    const response = await APIs.get(`https://toquocbinh2102.pythonanywhere.com/users/${userLogin.id}/`);
                    console.log("User data:", response.data); // Kiểm tra dữ liệu người dùng
                    setUser({
                        first_name: response.data.first_name || "",
                        last_name: response.data.last_name || "",
                        username: response.data.username || "",
                        image: response.data.image || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching user data", error);
                Alert.alert("Không thể lấy thông tin người dùng");
            }
        };
        if (userLogin && userLogin.id) {
            fetchUserData();
        }
    }, [userLogin]);

    const change = (value, field) => {
        setUser({ ...user, [field]: value });
    };

    const handleImagePick = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.status !== 'granted') {
                alert('Quyền truy cập ảnh bị từ chối');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
                setImages([{ ...result.assets[0], base64 }]);
            } else {
                console.log('Chọn ảnh bị hủy bỏ');
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const updateUser = async () => {
        try {
            let form = new FormData();
            for (let key in user) {
                if (key !== 'image') {
                    form.append(key, user[key]); // Chỉ thêm các trường cần thiết
                }
            }

            const image = images[0];
            if (image) {
                const imageName = image.fileName || `image.jpg`;
                const imageType = "image/jpeg";
                form.append('image', {
                    uri: image.uri,
                    type: imageType,
                    name: imageName,
                });
            }

            setLoading(true);
            const res = await APIs.patch(`https://toquocbinh2102.pythonanywhere.com/users/${userLogin.id}/`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.info(res.data);
            Alert.alert("Cập nhật thành công");
            nav.goBack(); // Quay lại trang trước
        } catch (error) {
            console.error("Error updating user", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={MyStyles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                
                {/* Hiển thị Avatar */}
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={handleImagePick}>
                        {/* Hiển thị avatar từ URL */}
                        <Image
                            source={{ uri: `https://toquocbinh2102.pythonanywhere.com${user.image}` }}
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: 50, // Để ảnh hình tròn
                                borderWidth: 2,
                                borderColor: '#ccc',
                            }}
                        />
                    </TouchableOpacity>
                </View>

                <HelperText type="error" visible={err}>
                    Mật khẩu KHÔNG khớp
                </HelperText>

               
                <Text style={MyStyles.margin}>Tên đăng nhập</Text>
                <TextInput
                    value={user.username}
                    onChangeText={(t) => change(t, 'username')}
                    style={MyStyles.margin}
                    placeholder="Nhập tên đăng nhập"
                />

           

              
                <Text style={MyStyles.margin}>Họ</Text>
                <TextInput
                    value={user.last_name}
                    onChangeText={(t) => change(t, 'last_name')}
                    style={MyStyles.margin}
                    placeholder="Nhập họ"
                />

                 
                <Text style={MyStyles.margin}>Tên</Text>
                <TextInput
                    value={user.first_name}
                    onChangeText={(t) => change(t, 'first_name')}
                    style={MyStyles.margin}
                    placeholder="Nhập tên"
                />

                <Button loading={loading} mode="contained" onPress={updateUser}>
                    Cập nhật thông tin
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
};

export default ThayDoiThongTin;
