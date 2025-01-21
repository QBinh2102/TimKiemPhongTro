import { View, Text } from "react-native"
import { Avatar, ListItem } from 'react-native-elements'
import MyStyles from "../../styles/MyStyles";
import React from "react";
import APIs, { endpoints } from "../../configs/APIs";
import { Title } from "react-native-paper";

const Home = () => {
    const [baidangs, setBaidangs] = React.useState([]);

    const loadBaidangs = async () => {
        let res = await APIs.get(endpoints['baidangs']);
        console.info(res.data);
        setBaidangs(res.data);
    }

    React.useEffect(() => {
        loadBaidangs();
    }, []);

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>Bình vip pro</Text>
            {baidangs.map(b => (
                <ListItem key={b.id} bottomDivider>
                    <Avatar
                        rounded
                        source={{ uri: b.nguoiDangBai.image }}
                    />
                    {/* <ListItem.Content> */}
                    <Title>{b.nguoiDangBai.username}</Title>
                        {/* <ListItem.Subtitle>{b.tieuDe}</ListItem.Subtitle> */}
                    {/* </ListItem.Content> */}
                </ListItem>
            ))}
        </View>
    );
}

export default Home;