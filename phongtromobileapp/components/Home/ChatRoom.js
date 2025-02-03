import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView } from 'react-native';
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import { Text } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { getDatabase, ref, query, orderByChild, equalTo, get, onValue, push, set } from "firebase/database";

export default function ChatRoom({ navigation }) {
    const user = useContext(MyUserContext);
    const route = useRoute();
    const { userInfo } = route.params;
    console.info(route)
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollViewRef = useRef();

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useLayoutEffect(() => {
        if (userInfo && userInfo.username) {
            navigation.setOptions({
                headerTitle: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={userInfo?.image ? { uri: `https://toquocbinh2102.pythonanywhere.com${userInfo.image}` } : null}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                marginRight: 10, 
                            }}
                        />
                        <Text style={{ fontWeight: 'bold' }}>{userInfo.username}</Text>
                    </View>
                ),
            });
        }
    }, [navigation]);

    const handleSendMessage = () => {
        if(message!=""){
            const nguoiGui = user.id.toString();
            const nguoiNhan = userInfo.id.toString();
            const db = getDatabase();
            const groupKey = [nguoiGui, nguoiNhan].sort().join("_");
            const chatsRef = ref(db, `chats/${groupKey}`);
            const newChatRef = push(chatsRef);
            const ngayGui = new Date().toISOString();
            
            set(newChatRef, {
                nguoiGui: nguoiGui,
                nguoiNhan: nguoiNhan,
                noiDung: message,
                ngayGui: ngayGui,
            })
            .then(() => {
                console.log("Dữ liệu đã được gửi thành công");
                setMessage("");
            })
            .catch((error) => {
                console.error("Lỗi khi gửi dữ liệu: ", error);
            });
        }
    };

    useEffect(() => {
        setLoading(true);
        getChats(user.id, userInfo.id);
    }, [user, userInfo]);

    const getChats = async (idUser1, idUser2) => {
        try {
            const db = getDatabase();
            const groupKey = [idUser1, idUser2].sort().join("_");
            const chatsRef = ref(db, `chats/${groupKey}`);
            const chatsQuery = query(chatsRef, orderByChild('ngayGui'));
    
            const snapshot = await get(chatsQuery);
            if (snapshot.exists()) {
                const data = snapshot.val(); 
                const chatList = Object.values(data); 
                setMessages(chatList );
            } else {
                console.log("Không có chat nào cho người dùng này.");
                setMessages([]); 
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat: ', error); 
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            console.info(messages);
            setLoading(false); 
        }
    }, [messages]);

    const listenForNewMessages = (idUser1, idUser2) => {
        const db = getDatabase();
        const conversationId = [idUser1, idUser2].sort().join('_');
        const messagesRef = ref(db, `chats/${conversationId}`);
    
        const q = query(
            messagesRef,
            orderByChild('ngayGui')
        );
    
        onValue(q, (snapshot) => {
            const messages = [];
            snapshot.forEach((childSnapshot) => {
                const message = childSnapshot.val();
                messages.push(message);
            });
    
            setMessages(messages);
        });
    };
    
    useEffect(() => {
        listenForNewMessages(user.id, userInfo.id);
    
        return () => {

        };
    }, [user, userInfo]);

    return (
        <View style={{ flex: 1 }}>
    {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* <ActivityIndicator size="large" /> */}
        </View>
    ) : (
        <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 10 }}
        >
            {messages.map((message, index) => (
                <View
                    key={index}
                    style={{
                        marginBottom: 15,
                        alignItems: message.nguoiGui === user.id.toString() ? 'flex-end' : 'flex-start', 
                    }}
                >
                    <View
                        style={{
                            backgroundColor: message.nguoiGui === user.id.toString() ? '#007bff' : '#ffffff', 
                            borderRadius: 20,
                            padding: 10,
                            marginRight: message.nguoiGui === user.id.toString() ? 5 : 0,
                            marginLeft: message.nguoiGui !== user.id.toString() ? 5 : 0,
                            maxWidth: '70%',
                        }}
                    >
                        <Text
                            style={{
                                color: message.nguoiGui === user.id.toString() ? '#fff' : '#000', 
                            }}
                        >
                            {message.noiDung}
                        </Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    )}
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            paddingVertical: 10,
        }}
    >
        <TextInput
            style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 20,
                paddingHorizontal: 15,
                height: 40,
                marginRight: 10,
                marginLeft: 10,
            }}
            placeholder="Nhập tin nhắn..."
            value={message}
            onChangeText={setMessage}
        />

        <TouchableOpacity
            style={{
                backgroundColor: '#007bff',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                marginRight: 10,
            }}
            onPress={handleSendMessage}
        >
            <Text style={{ color: '#fff' }}>Gửi</Text>
        </TouchableOpacity>
    </View>
</View>
    );
}
