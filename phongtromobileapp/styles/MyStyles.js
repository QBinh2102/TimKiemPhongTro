import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center"
    }, row: {
        flexDirection: "row",
        flexWrap: "wrap"
    }, margin: {
        margin: 5
    }, subject: {
        fontSize: 25,
        color: "blue",
        fontWeight: "bold"
    }, box: {
        width: 80,
        height: 80,
        borderRadius: 10
    }, link: {
         color: 'blue', 
         textAlign: 'center', 
         marginTop: 10 
    }, title: {
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center'
    }
})