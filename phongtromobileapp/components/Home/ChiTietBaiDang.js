import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-elements";
import { Subheading } from "react-native-paper";
import { MyUserContext } from "../../configs/MyUserContext";

const ChiTietBaiDang = ({ route, navigation }) => {
  const userLogin = useContext(MyUserContext);
  const { baiDang } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);  
  const [postOwner, setPostOwner] = useState(null);  

  useEffect(() => {
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

    fetch(`https://toquocbinh2102.pythonanywhere.com/users/${baiDang.nguoiDangBai}`)
      .then(response => response.json())
      .then(userData => {
        setPostOwner(userData); 
      })
      .catch(error => console.error("Lỗi khi lấy thông tin người đăng bài:", error));
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
            fetch(`https://toquocbinh2102.pythonanywhere.com/baidangchothues/${baiDang.id}/`, {
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
  postTypeTag: {
    fontSize: 14,
    color: "#fff",
    backgroundColor: "#0288d1",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
    textAlign: "center",
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
});

export default ChiTietBaiDang;
