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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const db = getDatabase();
            const chatsRef = ref(db, 'chats');
            
            // Lắng nghe sự thay đổi dữ liệu trên Firebase
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
                setLoading(false);  // Kết thúc việc load dữ liệu
            });
        }
    }, [user]); // Lắng nghe sự thay đổi của `user`

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

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
