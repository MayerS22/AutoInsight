import { createSlice, configureStore } from "@reduxjs/toolkit";


const initialAuthState = {
    isLoggedIn: false,
    profilePicture: null,
    username: "",
    email:"",
    id:"",
    datasetOwnerId:"",
    country:"",
    jobTitle:"",
}

const initialMarginState = {
    margin: "",
    color: "bg-purple-50",
    isRemoved:false,
    isAdded:false,
}


const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        login(state,action) {
            state.isLoggedIn = true;
            state.email = action.payload.email;
            localStorage.setItem("isLoggedIn", JSON.stringify(true));
            localStorage.setItem("email", action.payload.email);
            localStorage.setItem("token", action.payload.token);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.email = null;
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("email");
            localStorage.removeItem("token");
            const userId = localStorage.getItem("userId"); 
            localStorage.removeItem(`chatMessages_${userId}`);
            localStorage.removeItem("userId");
        },
        addProfilePicture(state,action){
            state.profilePicture = action.payload;
        },
        addUsername(state,action){
            state.username = action.payload;
        },
        addID(state,action){
            state.id = action.payload;
        },
        addEmail(state,action){
            state.email = action.payload;
        },
        addDatasetOwnerId(state,action){
            state.id=action.payload;
        },
        addCountry(state,action){
            state.country=action.payload;
        },
        addJobTitle(state,action){
            state.jobTitle=action.payload;
        },
    }
});

const marginSlice = createSlice({
    name: 'margin',
    initialState: initialMarginState,
    reducers: {
        setMargin(state, action) {
            state.margin = action.payload;
        },
        removeMargin(state) {
            state.margin = 0;
        },
        setColor(state, action) {
            state.color = action.payload;
        }
        ,
        removeUserName(state){
            state.isRemoved=true;
        },
        addUserName(state){
            state.isRemoved=false;
        },
        addLogoutIcon(state){
          state.isAdded=true;
        },
        removeLogoutIcon(state){
          state.isAdded=false;
        }
    }
});


export const authActions = authSlice.actions;
export const marginActions = marginSlice.actions;

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        margin: marginSlice.reducer
    }
});
export default store;