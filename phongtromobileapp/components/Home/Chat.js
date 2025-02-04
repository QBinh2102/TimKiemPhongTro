import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import ChatList from "./ChatList";
import { equalTo, get, getDatabase, onValue, ref } from "firebase/database";

const Chat = () => {
    const user = useContext(MyUserContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);  // Thêm trạng thái loading cho toàn bộ component

    useEffect(() => {
        if (user) {
            getUsers(user.id);

            const db = getDatabase();
            const chatsRef = ref(db, 'chats');
            onValue(chatsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const selectedChats = [];

                    Object.keys(data).forEach(groupKey => {
                        if (groupKey.includes(user.id.toString())) {
                            const group = data[groupKey];

                            const filteredMessages = Object.values(group).filter(message =>
                                message.nguoiGui === user.id.toString() || message.nguoiNhan === user.id.toString()
                            );

                            const sortedMessages = filteredMessages.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui));

                            if (sortedMessages.length > 0) {
                                selectedChats.push(sortedMessages[0]);
                            }
                        }
                    });

                    setUsers(selectedChats);
                } else {
                    console.log("Không có chat nào cho người dùng này.");
                    setUsers([]);  
                }
            });

            return () => {
                off(chatsRef);  // Tắt lắng nghe
            };
        }
    }, [user]);

    const getUsers = async (userId) => {
        try {
            const db = getDatabase();
            const chatsRef = ref(db, 'chats');
            const snapshot = await get(chatsRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const selectedChats = [];

                Object.keys(data).forEach(groupKey => {
                    if (groupKey.includes(userId.toString())) {
                        const group = data[groupKey];
                        const filteredMessages = Object.values(group).filter(message =>
                            message.nguoiGui === userId.toString() || message.nguoiNhan === userId.toString()
                        );

                        const sortedMessages = filteredMessages.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui));

                        if (sortedMessages.length > 0) {
                            selectedChats.push(sortedMessages[0]);
                        }
                    }
                });

                setUsers(selectedChats);
            } else {
                console.log("Không có chat nào cho người dùng này.");
                setUsers([]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat: ', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="light" />

            {users.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Chưa có cuộc trò chuyện nào</Text>
                </View>
            ) : (
                <ChatList users={users} />
            )}
        </View>
    );
};

export default Chat;
