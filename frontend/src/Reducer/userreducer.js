import {REQUEST_USER_NO,
        SUCCESS_USER_NO,
        FAIL_USER_NO,
        REQUEST_USER,
        SUCCESS_USER,
        FAIL_USER,
        REQUEST_VERIFY_OTP,
        SUCCESS_VERIFY_OTP,
        FAIL_VERIFY_OTP,
        REQUEST_RESEND_OTP,
        SUCCESS_RESEND_OTP,
        FAIL_RESEND_OTP,
        REQUEST_UPDATE_USER,
        SUCCESS_UPDATE_USER,
        FAIL_UPDATE_USER,
        SUCCESS_LOGOUT,
        FAIL_LOGOUT,
        REQUEST_UPDATE_DETAILS_USER,
        SUCCESS_UPDATE_DETAILS_USER,
        FAIL_UPDATE_DETAILS_USER,
        CLEAR_ERRORS,
        REGISTER_USER_DATA,
        SUCCESS_REGISTER_USER,
        FAIL_REGISTER_USER,
        FAIL_LOGIN_USER,
        SUCCESS_LOGIN_USER,
        LOGIN_USER_DATA,
        REQUEST_UPDATE_ADDRESS,
        SUCCESS_UPDATE_ADDRESS,
        FAIL_UPDATE_ADDRESS,
        REQUEST_ALL_ADDRESS,
        SUCCESS_ALL_ADDRESS,
        FAIL_ALL_ADDRESS
} from '../const/userconst'

export const registeruser = (state = {user:null}, action) =>{
        switch (action.type) {
            case REGISTER_USER_DATA:
                return {
                    loading: true,
                };

            case SUCCESS_REGISTER_USER:
                return {
                    loading: false,
                    user:action?.payload, 
                    message:action?.message
                };

            case FAIL_REGISTER_USER:
                    return {
                        loading: null,
                        user:action.payload
                    };
            case CLEAR_ERRORS:
                        return {
                            ...state,
                            error: null
                    };
        
            default:
                return state;
        }
}
export const loginuser = (state = {user:null}, action) =>{
    switch (action.type) {
        case LOGIN_USER_DATA:
            return {
                loading: true,
            };

        case SUCCESS_LOGIN_USER:
            return {
                loading: false,
                user:action.payload || null, 
                message:action?.message
            };

        case FAIL_LOGIN_USER:
                return {
                    loading: null,
                    user:null
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
    
        default:
            return state;
    }
}
export const getuser = (state = {user:null}, action) =>{
    switch (action.type) {
        case REQUEST_USER:
            return {
                loading: true,
                isAuthentication: false
            };

        case SUCCESS_USER:
            return {
                loading: false,
                isAuthentication: true,
                user:action.payload
            };
            case SUCCESS_LOGOUT:
            return {
                loading: false,
                isAuthentication: false,
                user:null
            };
            

        case FAIL_USER:
                case FAIL_LOGOUT:
                return {
                    loading: false,
                    isAuthentication: false,
                    error:action.payload
                };

        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
    
        default:
            return state;
    }
}

export const otpverifie = (state = {userVerify:null}, action) =>{
    switch (action.type) {

        case REQUEST_VERIFY_OTP:
        return {
            loading: true,
        };

        case SUCCESS_VERIFY_OTP:
            return {
                loading: false,
                userVerify:action.payload
            };

        case FAIL_VERIFY_OTP:
            return {
                loading: true,
                error:action.payload
            };

    case CLEAR_ERRORS:
                return {
                    ...state,
                    error: null
            };

    default:
        return state;
    }
}
export const addressupdate = (state = {updatedAddress:null}, action) =>{
    switch (action.type) {
        case REQUEST_UPDATE_ADDRESS:
            return {
                loading: true,
            };

        case SUCCESS_UPDATE_ADDRESS:
            return {
                loading: false,
                updatedAddress:action.payload
            };

        case FAIL_UPDATE_ADDRESS:
            return {
                loading: false,
                error:action.payload
            };

        case CLEAR_ERRORS:
                return {
                    ...state,
                    error: null
            };
    
        default:
            return state;
    }
}
export const getAddress = (state = {allAddresses:[]}, action) =>{
    switch (action.type) {
        case REQUEST_ALL_ADDRESS:
            return {
                loading: true,
            };

        case SUCCESS_ALL_ADDRESS:
            return {
                loading: false,
                allAddresses:action.payload || []
            };

        case FAIL_ALL_ADDRESS:
            return {
                loading: false,
                error:action.payload
            };

        case CLEAR_ERRORS:
                return {
                    ...state,
                    error: null
            };
    
        default:
            return state;
    }
}
export const resendotp = (state = {}, action) =>{
    switch (action.type) {
        
            case REQUEST_RESEND_OTP:
            return {
                loading: true,
            };

        case SUCCESS_RESEND_OTP:
            return {
                loading: false,
                success: action.payload
            };

        case FAIL_RESEND_OTP:
            
                return {
                    loading: false,
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
    
        default:
            return state;
    }
}

export const updateuser = (state = {user:{}}, action) =>{
    switch (action.type) {
        
            case REQUEST_UPDATE_USER:
            return {
                loading: true,
                user:{}
            };

        case SUCCESS_UPDATE_USER:
            return {
                loading: false,
                user: action.payload
            };

        case FAIL_UPDATE_USER:
            
                return {
                    loading: false,
                    user:null
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
    
        default:
            return state;
    }
}

export const updatedetailsuserreducer = (state = {user:{}}, action) =>{
    switch (action.type) {
        
            case REQUEST_UPDATE_DETAILS_USER:
            return {
                loading: true,
                
            };

        case SUCCESS_UPDATE_DETAILS_USER:
            return {
                loading: false,
                success: action.payload
            };

        case FAIL_UPDATE_DETAILS_USER:
            
                return {
                    loading: false,
                    success:'Update Failed'
                };
        case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                };
    
        default:
            return state;
    }
}

