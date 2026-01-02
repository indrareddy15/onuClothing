import { BASE_API_URL, headerConfig } from '../config'
import {
    REQUEST_USER,
    SUCCESS_USER,
    FAIL_USER,
    REQUEST_UPDATE_USER,
    SUCCESS_UPDATE_USER,
    FAIL_UPDATE_USER,
    SUCCESS_LOGOUT,
    FAIL_LOGOUT,
    REQUEST_UPDATE_DETAILS_USER,
    SUCCESS_UPDATE_DETAILS_USER,
    FAIL_UPDATE_DETAILS_USER,
    CLEAR_ERRORS,
    LOGIN_USER_DATA,
    SUCCESS_LOGIN_USER,
    FAIL_LOGIN_USER,
    REQUEST_UPDATE_ADDRESS,
    SUCCESS_UPDATE_ADDRESS,
    FAIL_UPDATE_ADDRESS,
    REQUEST_ALL_ADDRESS,
    FAIL_ALL_ADDRESS,
    SUCCESS_ALL_ADDRESS
} from '../const/userconst'
import axios from 'axios'

export const loginmobile = (sendingData) => async () => {
    try {
        console.log("logIn Data: ", sendingData)
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/loginmobile`, sendingData)
        return data;
    } catch (error) {
        return null;
    }
}
export const loginVerify = (verifyData) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_USER_DATA })
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/loginmobile/verify`, verifyData)
        const token = data?.result?.token
        localStorage.setItem('token', token)
        dispatch({ type: SUCCESS_LOGIN_USER, payload: data?.result, message: data?.message })
        return data;
    } catch (error) {
        dispatch({ type: FAIL_LOGIN_USER, payload: error.response?.data?.message })
        return null;
    }
}
export const registerUser = (userData) => async (dispatch) => {
    try {
        // dispatch({ type: REGISTER_USER_DATA })
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/registermobile`, userData)
        // dispatch({ type: SUCCESS_REGISTER_USER, payload: data?.result, message: data?.message })
        return data?.result;
    } catch (error) {
        // dispatch({ type: FAIL_REGISTER_USER, payload: null ,message: "Error Occurred"})
        return null;
    }
}

export const getuser = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        dispatch({ type: REQUEST_USER })
        if (!token) {
            dispatch({ type: FAIL_USER, payload: null })
            return;
        }
        const { data } = await axios.get(`${BASE_API_URL}/api/auth/check-auth`, headerConfig())
        dispatch({ type: SUCCESS_USER, payload: data.user })
    } catch (error) {
        dispatch({ type: FAIL_USER, payload: error.response?.data?.message })
    }
}
export const updateAddress = (address) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        dispatch({ type: REQUEST_UPDATE_ADDRESS })
        const { data } = await axios.put(`${BASE_API_URL}/api/auth/updateAddress`, address, headerConfig())
        console.log("Updated Data: ", data)
        dispatch({ type: SUCCESS_UPDATE_ADDRESS, payload: data?.success })
    } catch (error) {
        dispatch({ type: FAIL_UPDATE_ADDRESS, payload: error.message })
    }
}
export const removeAddress = (addressIndex) => async (dispatch) => {
    try {
        // const token = localStorage.getItem('token');
        console.log("Address Index: ", addressIndex)
        dispatch({ type: REQUEST_UPDATE_ADDRESS })
        const { data } = await axios.patch(`${BASE_API_URL}/api/auth/removeAddress`, { addressId: addressIndex }, headerConfig())
        console.log("Updated Data: ", data)
        dispatch({ type: SUCCESS_UPDATE_ADDRESS, payload: data.success })
    } catch (error) {
        dispatch({ type: FAIL_UPDATE_ADDRESS, payload: error.message })
    }
}
export const getAddress = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        // console.log(token);
        dispatch({ type: REQUEST_ALL_ADDRESS })
        if (!token) {
            dispatch({ type: FAIL_ALL_ADDRESS, payload: null })
            return;
        }
        const { data } = await axios.get(`${BASE_API_URL}/api/auth/getAddress`, headerConfig())
        dispatch({ type: SUCCESS_ALL_ADDRESS, payload: data.allAddresses })
    } catch (error) {
        dispatch({ type: FAIL_ALL_ADDRESS, payload: error.response?.data?.message })
    }
}

export const getConvinceFees = () => async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/common/website/convenienceFees`);
        return response.data.result;
    } catch (error) {
        console.error("Failed to get: ", error);
    }
}

export const otpverifie = (sendingData) => async (dispatch) => {
    try {
        // dispatch({ type: REQUEST_VERIFY_OTP })
        console.log("Otp: MobileNo. ", sendingData)
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/otpverify`, sendingData)
        if (data?.result?.verify === 'verified') {
            const token = data?.token
            console.log("Token: ", token)
            if (token) {
                localStorage.setItem('token', token)
            }
            // Update Redux state immediately
            dispatch({ type: SUCCESS_LOGIN_USER, payload: data?.result, message: "Login Successful" })
            dispatch({ type: SUCCESS_USER, payload: data?.result })
        }
        return data
        // dispatch({ type: SUCCESS_VERIFY_OTP, payload: data?.result })
    } catch (Error) {
        // dispatch({ type: FAIL_VERIFY_OTP, payload: Error.response.data.message })
        return Error.response?.data?.message || "Verification Failed";
    }
}

export const resendotp = (sendingData) => async () => {
    try {
        const { data } = await axios.post(`${BASE_API_URL}/api/auth/resendotp`, sendingData)
        return data
    } catch (Error) {
        return false;
    }
}



export const updateuser = (userdata) => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_UPDATE_USER })
        const { data } = await axios.put(`${BASE_API_URL}/api/auth/updateuser`, userdata, headerConfig())
        console.log("Update User Data: ", data.result)
        if (data.token) {
            const token = data?.token
            localStorage.removeItem('token');
            localStorage.setItem('token', token)

        }
        dispatch({ type: SUCCESS_UPDATE_USER, payload: data.result })

    } catch (Error) {
        dispatch({ type: FAIL_UPDATE_USER, payload: Error.response.data.message })
    }
}

export const updatedetailsuser = (userdata, id) => async (dispatch) => {

    try {

        dispatch({ type: REQUEST_UPDATE_DETAILS_USER })

        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.put(`${BASE_API_URL}/api/auth/user/${id}`, userdata, config)

        dispatch({ type: SUCCESS_UPDATE_DETAILS_USER, payload: data.success })

    } catch (Error) {

        dispatch({ type: FAIL_UPDATE_DETAILS_USER, payload: Error.response.data.message })

    }
}


export const logout = () => async (dispatch) => {

    try {
        console.log("logout")
        const res = await axios.post(`${BASE_API_URL}/api/auth/logout`)
        localStorage.removeItem("token");
        dispatch({ type: SUCCESS_LOGOUT, payload: null })
    } catch (Error) {
        dispatch({ type: FAIL_LOGOUT, payload: Error.response.data.message })
    }
}




export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS

    })
}