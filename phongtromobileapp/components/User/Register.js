import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, RadioButton, TextInput  } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import * as ImagePicker from 'expo-image-picker';
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import { Input } from "react-native-elements";
import { launchImageLibrary } from 'react-native-image-picker';

const Register = () => {
    const [user, setUser] = useState({vaiTro:'3'});

    const users = {
        "first_name": {
            "title": "Tên",
            "field": "first_name",
            "icon": "text",
            "secureTextEntry": false
        }, "last_name": {
            "title": "Họ và tên lót",
            "field": "last_name",
            "icon": "text",
            "secureTextEntry": false
        }, "email": {
            "title": "Email",
            "field": "email",
            "icon": "text",
            "secureTextEntry": false
        }, "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "icon": "text",
            "secureTextEntry": false
        }, "password": {
            "title": "Mật khẩu",
            "field": "password",
            "icon": "eye",
            "secureTextEntry": true
        }, "confirm": {
            "title": "Xác nhận mật khẩu",
            "field": "confirm",
            "icon": "eye",
            "secureTextEntry": true
        }, "SDT": {
            "title": "Số điện thoại",
            "field": "SDT",
            "icon": "text",
            "secureTextEntry": false
        }
    }
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);

    const change = (value, field) => {
        setUser({...user, [field]: value});
    }

    // const handleChange = (e) =>{
    //     if([e.target.name] == "image"){
    //         setPostImage({
    //             image: e.target.file,
    //         });
    //     }
    // }

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                change(result.assets[0], 'image');
        }
    }

    const convertUriToFile = async (uri, fileName) => {
    try {
        const response = await fetch(uri);  // Fetch file from URI
        const blob = await response.blob(); // Convert to Blob
        const file = new File([blob], fileName, { type: blob.type });  // Convert Blob to File
        return file;
    } catch (error) {
        console.error("Error converting URI to File:", error);
    }
};

    const register = async () => {
        if (user.password !== user.confirm)
            setErr(true);
        else {
            setErr(false);
            let form = new FormData();
            // for (let key in user)
            //     if (key !== 'confirm') {
            //         if (key === 'image') {
            //             form.append('image', {
                        //     uri: user.image.uri,
                        //     name: user.image.fileName || 'image.jpg',
                        //     type: user.image.type || 'image/jpeg',
                        // })
            //         } else
            //         form.append(key, user[key]);
            //     }
            console.info(user.image.uri)
            console.info(user.image.name)
            console.info(user.image.type)
            if (user.image) {
                form.append('image', {
                    uri: user.image.uri,
                    name: user.image.fileName || 'image.jpg',
                    type: user.image.type || 'image/jpeg',
                })
            }
            for (let key in user)
                if (key !== 'confirm'&&key!=='image') {
                    form.append(key, user[key]);
                }

            console.info(form);
            try {
                setLoading(true);
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.info(res.data)
                Alert.alert("Đăng ký thành công, mời bạn đăng nhập")
                nav.navigate("Login");
            } catch (ex) {
                console.error(JSON.stringify(ex));
            } finally {
                setLoading(false);
            }
        }
    };
    

    return (
        <View style={MyStyles.container}>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <HelperText type="error" visible={err}>
                Mật khẩu KHÔNG khớp
                </HelperText>
            
                {Object.values(users).map(u => <TextInput secureTextEntry={u.secureTextEntry} key={u.field} value={user[u.field]} onChangeText={t => change(t, u.field)} 
                style={MyStyles.margin} placeholder={u.title} right={<TextInput.Icon icon={u.icon} />} />)}

                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                    <RadioButton
                        value="2"
                        status={user.vaiTro === '2' ? 'checked' : 'unchecked'}
                        onPress={() => setUser({ ...user, vaiTro: '2' })}
                    />
                    <Text>CHUNHATRO (Chủ nhà trọ)</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                    <RadioButton
                        value="3"
                        status={user.vaiTro === '3' ? 'checked' : 'unchecked'}
                        onPress={() => setUser({ ...user, vaiTro: '3' })}
                    />
                    <Text>NGUOITHUETRO (Người thuê trọ)</Text>
                </View>

                <TouchableOpacity onPress={pickImage}>
                    <Text style={MyStyles.margin}>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>
                {user.image ? <Image source={{ uri: user.image.uri }} style={{ width: 100, height: 100 }} /> : ""}


                <Button loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </KeyboardAvoidingView>
        </View>
    );
}

export default Register;