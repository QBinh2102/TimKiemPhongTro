import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import ChatItem from "./ChatItem";
import { useRouter } from "expo-router";

export default function ChatList({users}){
    const sortedUsers = users.sort((a, b) => new Date(b.ngayGui) - new Date(a.ngayGui));
    return (
        <View classname="flex-1">
            <FlatList
                data={sortedUsers}
                // contentContainerStyle={{flex: 1, paddingVertical: 25}}
                keyExtractor={item=> Math.random()}
                showsVerticalScrollIndicator={false}
                renderItem={({item,index})=> <ChatItem 
                    noBorder={index+1==users.length} 
                    item={item} 
                    index={index}
                />}
            />
        </View>
    )
}