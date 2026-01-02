import axios from 'axios'
import {
    REQUEST_FEATCH_BANNERS,
    SUCCESS_FEATCH_BANNERS,
    FAIL_FEATCH_BANNERS,
    CLEAR_ERRORS,
	REQUEST_FETCH_ALL_CATEGORY_BANNERS,
	FETCH_ALL_CATEGORY_BANNERS_SUCCESS,
	FETCH_ALL_CATEGORY_BANNERS_FAIL
} from '../const/bannerconst'
import { BASE_API_URL } from '../config'

export const featchallbanners = () => async (dispatch) => {
    try {

        dispatch({ type: REQUEST_FEATCH_BANNERS })
        const res = await axios.get(`${BASE_API_URL}/api/common/fetch/all`)
        const data = res?.data;
        dispatch({ type: SUCCESS_FEATCH_BANNERS, payload: data?.result || []})
    } catch (error) {
        dispatch({ type: FAIL_FEATCH_BANNERS, payload: error.response.data.message })
    }
}

export const fetchAllCategoryBanners = ()=> async (dispatch) => {
	try {

        dispatch({ type: REQUEST_FETCH_ALL_CATEGORY_BANNERS })
        const res = await axios.get(`${BASE_API_URL}/api/common/categoryBanners/all`)
        const data = res?.data;
        dispatch({ type: FETCH_ALL_CATEGORY_BANNERS_SUCCESS, payload: data?.result || []})
    } catch (error) {
        dispatch({ type: FETCH_ALL_CATEGORY_BANNERS_FAIL, payload: error.response.data.message })
    }
}



export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}