import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    addressList : []
}
//console.log("initialValue",initialValue);


const addressSlice = createSlice({
    name : 'address',
    initialState : initialValue,
    reducers : {
        handleAddAddress : (state,action)=>{
            state.addressList = [...action.payload]
        }
    }
})

export const {handleAddAddress  } = addressSlice.actions

export default addressSlice.reducer