import axios from 'axios';
import { BASE_API_URL } from '../config';
import {
    REQUEST_FETCH_VIDEO_REVIEWS,
    SUCCESS_FETCH_VIDEO_REVIEWS,
    FAIL_FETCH_VIDEO_REVIEWS,
} from '../const/videoReviewConst';

export const fetchVideoReviews = () => async (dispatch) => {
    try {
        dispatch({ type: REQUEST_FETCH_VIDEO_REVIEWS });
        const { data } = await axios.get(`${BASE_API_URL}/api/common/video-reviews`);
        dispatch({ type: SUCCESS_FETCH_VIDEO_REVIEWS, payload: data?.result || [] });
    } catch (error) {
        dispatch({ type: FAIL_FETCH_VIDEO_REVIEWS, payload: error?.response?.data?.message });
    }
};
