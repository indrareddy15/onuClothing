import {
    FETCH_ADDRESS_FORM,
    FETCH_ADDRESS_FORM_SUCCESS,
    FETCH_ADDRESS_FORM_FAIL,
    CLEAR_ERRORS,
    FETCH_ALL_OPTIONS_REQUEST,
    FETCH_ALL_OPTIONS_SUCCESS,
    FETCH_ALL_OPTIONS_FAIL,
    FETCH_ALL_COUPONS_REQUEST,
    FETCH_ALL_COUPONS_SUCCESS,
    FETCH_ALL_COUPONS_FAIL,
    FETCH_DISCLAIMERS_REQUEST,
    FETCH_DISCLAIMERS_SUCCESS,
    FETCH_DISCLAIMERS_FAIL,
	FETCH_TERMS_AND_CONDITIONS,
	FETCH_TERMS_AND_CONDITIONS_SUCCESS,
	FETCH_TERMS_AND_CONDITIONS_FAIL,
	FETCH_PRIVACY_AND_POLICY,
	FETCH_PRIVACY_AND_POLICY_SUCCESS,
	FETCH_PRIVACY_AND_POLICY_FAIL,
	FETCH_FAQS,
	FETCH_FAQS_SUCCESS,
	FETCH_FAQS_FAIL
} from '../const/common.const'

export const fetch_form_banners = (state = {formData:[]}, action) =>{
    switch (action.type) {
        case FETCH_ADDRESS_FORM:
            return {
                loading: true,
            };
        case FETCH_ADDRESS_FORM_SUCCESS:
            return {
                loading: false,
                formData:action.payload,
            };
        case FETCH_ADDRESS_FORM_FAIL:
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


export const fetch_All_Coupons = (state = {AllCoupons:[]}, action) =>{
    switch (action.type) {
        case FETCH_ALL_COUPONS_REQUEST:
            return {
                loading: true,
            };
        case FETCH_ALL_COUPONS_SUCCESS:
            return {
                loading: false,
                AllCoupons:action.payload,
            };
        case FETCH_ALL_COUPONS_FAIL:
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
export const fetchPrivacyAndPolicy = (state ={privacyPolicy:{}}, action) =>{
	switch (action.type) {
        case FETCH_PRIVACY_AND_POLICY:
            return {
                loading: true,
            };
        case FETCH_PRIVACY_AND_POLICY_SUCCESS:
            return {
                loading: false,
                privacyPolicy:action.payload || null,
            };
        case FETCH_PRIVACY_AND_POLICY_FAIL:
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
export const fetchAllFAQS = (state = {faqs:[]}, action) =>{
	switch (action.type) {
        case FETCH_FAQS:
            return {
                loading: true,
            };
        case FETCH_FAQS_SUCCESS:
            return {
                loading: false,
                faqs:action?.payload || [],
            };
        case FETCH_FAQS_FAIL:
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
export const fetchTermsAndCondition = (state = {termsAndcondition:{}}, action) =>{
	switch (action.type) {
        case FETCH_TERMS_AND_CONDITIONS:
            return {
                loading: true,
            };
        case FETCH_TERMS_AND_CONDITIONS_SUCCESS:
            return {
                loading: false,
                termsAndCondition:action.payload,
            };
        case FETCH_TERMS_AND_CONDITIONS_FAIL:
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


export const fetch_All_Options = (state = {AllOptions:[]}, action) =>{
    switch (action.type) {
        case FETCH_ALL_OPTIONS_REQUEST:
            return {
                loading: true,
            };
        case FETCH_ALL_OPTIONS_SUCCESS:
            return {
                loading: false,
                AllOptions:action.payload,
            };
        case FETCH_ALL_OPTIONS_FAIL:
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
export const fetchWebsiteDisclaimer = (state = {WebsiteDisclaimer:[]}, action) =>{
    switch (action.type) {
        case FETCH_DISCLAIMERS_REQUEST:
            return {
                loading: true,
            };
        case FETCH_DISCLAIMERS_SUCCESS:
            return {
                loading: false,
                WebsiteDisclaimer:action?.payload || [],
            };
        case FETCH_DISCLAIMERS_FAIL:
                return {
                    loading: false,
                    error: action.payload
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