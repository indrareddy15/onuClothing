import {
    REQUEST_FETCH_VIDEO_REVIEWS,
    SUCCESS_FETCH_VIDEO_REVIEWS,
    FAIL_FETCH_VIDEO_REVIEWS,
} from '../const/videoReviewConst';

export const fetch_video_reviews_reducer = (state = { videoReviews: [] }, action) => {
    switch (action.type) {
        case REQUEST_FETCH_VIDEO_REVIEWS:
            return { loading: true, videoReviews: state.videoReviews || [] };
        case SUCCESS_FETCH_VIDEO_REVIEWS:
            return { loading: false, videoReviews: action.payload };
        case FAIL_FETCH_VIDEO_REVIEWS:
            return { loading: false, videoReviews: [], error: action.payload };
        default:
            return state;
    }
};
