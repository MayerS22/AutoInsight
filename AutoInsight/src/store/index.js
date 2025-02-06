import { createSlice,configureStore } from "@reduxjs/toolkit";


const initialAuthState={
    isLoggedIn:false
}


const authSlice=createSlice({
    name:'auth',
    initialState:initialAuthState,
    reducers:{
        login(state){
            state.isLoggedIn=true;
        },
        logout(state){
            state.isLoggedIn=false;
        }
    }
});


export const authActions=authSlice.actions;

const store = configureStore({
    reducer:{
        auth:authSlice.reducer
    }
});
export default store;