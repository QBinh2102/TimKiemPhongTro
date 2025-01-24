export default MyUserReducers = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
        case 'UPDATE_TUONGTAC':
            return {
                ...currentState,  // Sử dụng currentState thay vì state
                tuongTac: action.payload,  
            };
        default:
            return currentState;
    }
};
