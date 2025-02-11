import { createSlice, configureStore } from "@reduxjs/toolkit";


const initialAuthState = {
    isLoggedIn: false
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
        login(state) {
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
        }
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