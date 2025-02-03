import { useContext, useEffect, useState } from "react";
import { Image, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

// API lấy thông tin người dùng
const getUserDetails = async (userId, token) => {
    try {
        const response = await axios.create({
            baseURL: "https://toquocbinh2102.pythonanywhere.com/",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).get(`/users/${userId}/`);

        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return null;
    }
};

export default function ChatItem({ item }) {
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [token, setToken] = useState(null);
    const navigation = useNavigation();

    // Lấy token từ AsyncStorage
    useEffect(() => {
        const fetchToken = async () => {
            setLoading(true);
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);  // Lưu token vào state
                } else {
                    console.log('Token không tồn tại');
                }
            } catch (error) {
                console.error('Lỗi khi lấy token từ AsyncStorage', error);
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (!token) return;

        const otherUserId = item.nguoiGui === String(user.id) ? item.nguoiNhan : item.nguoiGui;

        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const data = await getUserDetails(otherUserId, token);
                if (data) {
                    setUserInfo(data);
                } else {
                    console.log('Không có dữ liệu người dùng');
                }
            } catch (error) {
                console.error('Lỗi khi truy vấn thông tin người dùng', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [item, user.id, token]);

    const formatTime = (timeString) => {
        const now = new Date();
        const messageTime = new Date(timeString);
        const diff = now - messageTime;
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60) {
            return `${diffMinutes} phút trước`;
        } else if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else {
            return `${diffDays} ngày trước`;
        }
    };

    const handlePress = () => {
        navigation.navigate("ChatRoom", { userInfo });
    };

    return (
        <View>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                }}
                onPress={handlePress} // Thêm sự kiện nhấn vào đây
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Image
                            source={userInfo?.image ? { uri: `https://toquocbinh2102.pythonanywhere.com${userInfo.image}` } : null}
                            style={{ height: hp(6), width: hp(6), borderRadius: hp(3) }}
                        />
                    )}

                    <View style={{ marginLeft: 10 }}>
                        {loading ? (
                            <Text>Loading...</Text>
                        ) : (
                            <Text>{userInfo ? userInfo.username : null}</Text>
                        )}
                        {loading ? (
                            <Text>Loading message...</Text>
                        ) : (
                            <Text style={{ fontSize: 12, color: 'gray' }}>{item.noiDung}</Text>
                        )}
                    </View>
                </View>

                {loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <Text style={{ marginRight: 10 }}>{formatTime(item.ngayGui)}</Text>
                )}
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#ccc' }} />
        </View>
    );
}
