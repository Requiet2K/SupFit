import { ReviewState } from "../../types/reviewType";
import { apiSlice } from "../api/apiSlice"

export const reviewApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        isProductReviewed: builder.query({
            query: ({productId, userId} : {productId: number, userId: number}) => {
                return `/review/isProductReviewed?productId=${productId}&userId=${userId}`;
            }
        }),
        getProductReviews: builder.query({
            query: ({productId, page, size} : {productId: number, page: number, size: number}) => {
                return `/review/getProductReviews?productId=${productId}&page=${page}&size=${size}`;
            }
        }),
        getUserReviews: builder.query({
            query: userId => {
                return `/review/getUserReviews/${userId}`;
            }
        }),
        createReview: builder.mutation({
            query: ({review} : {review: ReviewState}) => ({
                url: `/review/createReview`,
                method: 'POST',          
                body: review
            })
        }),
        getProductTotalComments: builder.query({
            query: productId => {
                return `/review/getProductTotalComments/${productId}`;
            }
        }),
        getProductRating: builder.query({
            query: productId => {
                return `/review/getProductRating/${productId}`;
            }
        }),
        getRatingCounts: builder.query({
            query: productId => {
                return `/review/getRatingCounts/${productId}`;
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