import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import ChatList from "./ChatList";
import { equalTo, get, getDatabase, orderByChild, query, ref } from "firebase/database";

const Chat = () => {
    const user = useContext(MyUserContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);  // Thêm trạng thái loading cho toàn bộ component

    useEffect(() => {
        if (user) {
            // setLoading(true);  // Khi bắt đầu lấy dữ liệu, set loading = true
            getUsers(user.id);
        }
    }, [user]);

    // const getUsers = async (userId) => {
    //     try {
    //         const db = getDatabase();  // Khởi tạo kết nối đến Firebase Realtime Database
    
    //         // Truy vấn lấy dữ liệu chat
    //         const usersRef = ref(db, 'chats');  // Đường dẫn đến dữ liệu chat trong Firebase
    //         const usersQuery = query(usersRef);  // Lấy tất cả dữ liệu trong "chats"
    
    //         const snapshot = await get(usersQuery);  // Lấy dữ liệu từ Firebase
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();  // Dữ liệu trả về là một object
    //             const userList = Object.values(data);  // Chuyển object thành mảng
    
    //             // Lọc các chat có 'nguoiGui' hoặc 'nguoiNhan' bằng với userId
    //             const filteredChats = userList.filter(chat => 
    //                 chat.nguoiGui === userId.toString() || chat.nguoiNhan === userId.toString()
    //             );
    
    //             // Nhóm các chat lại theo 'nguoiGui' và 'nguoiNhan'
    //             const groupedChats = {};
    //             filteredChats.forEach(chat => {
    //                 // Tạo key dựa trên nguoiGui và nguoiNhan
    //                 const key = [chat.nguoiGui, chat.nguoiNhan].sort().join("_");
    
    //                 if (!groupedChats[key]) {
    //                     groupedChats[key] = [];
    //                 }
    //                 groupedChats[key].push(chat);
    //             });
    
    //             // Chọn chat có 'ngayGui' sớm nhất trong mỗi nhóm
    //             const selectedChats = [];
    //             Object.values(groupedChats).forEach(group => {
    //                 // Sắp xếp theo 'ngayGui' giảm dần và lấy chat có 'ngayGui' trễ nhất
    //                 const latestChat = group.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui))[0];
    //                 selectedChats.push(latestChat);
    //             });
    
    //             setUsers(selectedChats);  // Cập nhật trạng thái với danh sách các chat
    //         } else {
    //             console.log("Không có chat nào cho người dùng này.");
    //             setUsers([]);  // Nếu không có dữ liệu thì set mảng rỗng
    //         }
    //     } catch (error) {
    //         console.error('Lỗi khi lấy danh sách chat: ', error);  // Xử lý lỗi nếu có
    //     }
    // };

    const getUsers = async (userId) => {
        try {
            const db = getDatabase();  // Khởi tạo kết nối đến Firebase Realtime Database
    
            // Truy vấn lấy dữ liệu chat
            const chatsRef = ref(db, 'chats');  // Đường dẫn đến dữ liệu chat trong Firebase
            const snapshot = await get(chatsRef);  // Lấy dữ liệu từ Firebase
    
            if (snapshot.exists()) {
                const data = snapshot.val();  // Dữ liệu trả về là một object
                const selectedChats = [];
    
                // Duyệt qua các nhóm chat
                Object.keys(data).forEach(groupKey => {
                    // Kiểm tra xem nhóm chat có liên quan đến userId không
                    if (groupKey.includes(userId.toString())) {
                        const group = data[groupKey];  // Lấy tất cả tin nhắn trong nhóm
    
                        // Lọc tin nhắn theo nguoiGui hoặc nguoiNhan là userId
                        const filteredMessages = Object.values(group).filter(message =>
                            message.nguoiGui === userId.toString() || message.nguoiNhan === userId.toString()
                        );
    
                        // Sắp xếp tin nhắn trong nhóm theo 'ngayGui' giảm dần
                        const sortedMessages = filteredMessages.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui));
    
                        // Chọn tin nhắn mới nhất
                        if (sortedMessages.length > 0) {
                            selectedChats.push(sortedMessages[0]);
                        }
                    }
                });
    
                // Cập nhật trạng thái với danh sách các chat
                setUsers(selectedChats);  
            } else {
                console.log("Không có chat nào cho người dùng này.");
                setUsers([]);  // Nếu không có dữ liệu thì set mảng rỗng
            }
            
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chat: ', error);  // Xử lý lỗi nếu có
        }
    };
    

    // Sau khi đã tải xong tất cả dữ liệu
    // useEffect(() => {
    //     if (users.length > 0) {
    //         setLoading(false);  // Khi đã có dữ liệu chat, set loading = false
    //     }
    // }, [users]);

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style="light" />
            
            {users.length==0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <ActivityIndicator size="large" /> */}
                    <Text>Chưa có cuộc trò chuyện nào</Text>
                </View>
            ) : (
                <ChatList users={users} />
            )}
        </View>
    );
};

export default Chat;
