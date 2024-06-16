import { ReviewState } from "../../types/reviewType";
import { apiSlice } from "../api/apiSlice"

export const reviewApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        isProductReviewed: builder.query({
            query: ({productId, userId} : {productId: number, userId: number}) => {
                return `/api/v1/reviews/isReviewed?productId=${productId}&userId=${userId}`;
            }
        }),
        getProductReviews: builder.query({
            query: ({productId, page, size} : {productId: number, page: number, size: number}) => {
                return `/api/v1/reviews?productId=${productId}&page=${page}&size=${size}`;
            }
        }),
        getUserReviews: builder.query({
            query: userId => {
                return `/api/v1/reviews/userReviews/${userId}`;
            }
        }),
        createReview: builder.mutation({
            query: ({review} : {review: ReviewState}) => ({
                url: `/api/v1/reviews`,
                method: 'POST',          
                body: review
            })
        }),
        getProductTotalComments: builder.query({
            query: productId => {
                return `/api/v1/reviews/comments/${productId}`;
            }
        }),
        getProductRating: builder.query({
            query: productId => {
                return `/api/v1/reviews/rating/${productId}`;
            }
        }),
        getRatingCounts: builder.query({
            query: productId => {
                return `/api/v1/reviews/ratingCounts/${productId}`;
            }
        }),
    })
})

export const {
    useLazyIsProductReviewedQuery,
    useLazyGetUserReviewsQuery,
    useCreateReviewMutation,
    useLazyGetProductReviewsQuery,
    useLazyGetProductTotalCommentsQuery,
    useLazyGetProductRatingQuery,
    useLazyGetRatingCountsQuery
} = reviewApiSlice;