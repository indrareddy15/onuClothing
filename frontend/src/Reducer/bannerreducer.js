import {
    REQUEST_FEATCH_BANNERS,
    SUCCESS_FEATCH_BANNERS,
    FAIL_FEATCH_BANNERS,
    CLEAR_ERRORS,
	REQUEST_FETCH_ALL_CATEGORY_BANNERS,
	FETCH_ALL_CATEGORY_BANNERS_SUCCESS,
	FETCH_ALL_CATEGORY_BANNERS_FAIL
} from '../const/bannerconst'

export const fetch_banners_reducer = (state = {banners:[]}, action) =>{
    switch (action.type) {
        case REQUEST_FEATCH_BANNERS:
            return {
                loading: true,
            };
        case SUCCESS_FEATCH_BANNERS:
            return {
                loading: false,
                banners:action.payload,
            };
        case FAIL_FEATCH_BANNERS:
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
export const get_all_category_banners = (state = {categoryBanners:[]}, action) =>{
	switch (action.type) {
        case REQUEST_FETCH_ALL_CATEGORY_BANNERS:
            return {
                loading: true,
            };
        case FETCH_ALL_CATEGORY_BANNERS_SUCCESS:
            return {
                loading: false,
                categoryBanners:action.payload,
            };
        case FETCH_ALL_CATEGORY_BANNERS_FAIL:
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