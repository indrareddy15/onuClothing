import {
    REQUEST_PRODUCTS,
    SUCCESS_PRODUCTS,
    FAIL_PRODUCTS,
    REQUEST_SINGLE_PRODUCTS,
    SUCCESS_SINGLE_PRODUCTS,
    FAIL_SINGLE_PRODUCTS,
    CLEAR_ERRORS,
    REQUEST_OPTIONS,
    SUCCESS_OPTIONS,
    FAIL_OPTIONS,
    REQUEST_RANDOM_PRODUCT,
    SUCCESS_RANDOM_PRODUCT,
    FAIL_RANDOM_PRODUCT,
	REQUEST_All_PRODUCTS,
	SUCCESS_All_PRODUCTS,
	FAIL_All_PRODUCTS
} from '../const/productconst'

export const allProductNoFilter = (state = {noFilterProducts:[]}, action) =>{
	switch (action.type) {
        case REQUEST_All_PRODUCTS:
            return {
                loading: true,
            };

        case SUCCESS_All_PRODUCTS:
            return {
                loading: false,
                noFilterProducts:action.payload,
            };

        case FAIL_All_PRODUCTS:
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

export const Allproducts = (state = {product:[]}, action) =>{
    switch (action.type) {
        case REQUEST_PRODUCTS:
            return {
                loading: true,
            };

        case SUCCESS_PRODUCTS:
            return {
                loading: false,
                product:action.payload,
                pro: action.pro,
                length:action?.length || 0
            };

        case FAIL_PRODUCTS:
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

export const randomProducts = (state ={randomProducts:[]},action)=>{
    switch (action.type) {
        case REQUEST_RANDOM_PRODUCT:
            return {
                loading: true,
            };

        case SUCCESS_RANDOM_PRODUCT:
            return {
                loading: false,
                randomProducts:action.payload || []
            };

        case FAIL_RANDOM_PRODUCT:
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
export const allOptions = (state = {options:[]}, action) =>{
    switch (action.type) {
        case REQUEST_OPTIONS:
            return {
                loading: true,
            };

        case SUCCESS_OPTIONS:
            return {
                loading: false,
                options:action.payload || [],
            };

        case FAIL_OPTIONS:
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

export const singleProduct = (state = {Sproduct:{}}, action) =>{
    switch (action.type) {
        case REQUEST_SINGLE_PRODUCTS:
            return {
                loading: true,
            };

        case SUCCESS_SINGLE_PRODUCTS:
            return {
                loading: false,
                product:action.payload,
                similar: action.similar
            };

        case FAIL_SINGLE_PRODUCTS:
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
