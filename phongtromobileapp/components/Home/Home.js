import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Title, Subheading } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";

const Home = () => {
    const [baidangs, setBaidangs] = React.useState([]);

    const loadBaidangs = async () => {
        try {
            const res = await APIs.get(endpoints["baidangs"]);
            setBaidangs(res.data);
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    };

    React.useEffect(() => {
        loadBaidangs();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách bài đăng</Text>
            {baidangs.map((b) => (
                <ListItem key={b.id} bottomDivider>
                    <Avatar
                        rounded
                        size="medium"
                        source={{ uri: b.nguoiDangBai.image }}
                    />
                    <ListItem.Content>
                        <Title>{b.nguoiDangBai.username}</Title>
                        <Subheading style={styles.subtitle}>{b.tieuDe}</Subheading>
                        <Text style={styles.date}>
                            Ngày đăng: {new Date(b.created_date).toLocaleString("vi-VN")}
                        </Text>
                    </ListItem.Content>
                </ListItem>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        color: "#555",
        marginTop: 5,
    },
    date: {
        color: "#888",
        fontSize: 12,
        marginTop: 5,
    },
});

export default Home;
