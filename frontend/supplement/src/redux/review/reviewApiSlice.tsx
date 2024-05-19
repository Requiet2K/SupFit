import { ReviewState } from "../../types/reviewType";
import { apiSlice } from "../api/apiSlice"

export const reviewApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        isProductReviewed: builder.query({
            query: ({productId, userId} : {productId: number, userId: number}) => {
                return `/reviews/isReviewed?productId=${productId}&userId=${userId}`;
            }
        }),
        getProductReviews: builder.query({
            query: ({productId, page, size} : {productId: number, page: number, size: number}) => {
                return `/reviews/getReviews?productId=${productId}&page=${page}&size=${size}`;
            }
        }),
        getUserReviews: builder.query({
            query: userId => {
                return `/reviews/getUserReviews/${userId}`;
            }
        }),
        createReview: builder.mutation({
            query: ({review} : {review: ReviewState}) => ({
                url: `/reviews`,
                method: 'POST',          
                body: review
            })
        }),
        getProductTotalComments: builder.query({
            query: productId => {
                return `/reviews/getComments/${productId}`;
            }
        }),
        getProductRating: builder.query({
            query: productId => {
                return `/reviews/getRating/${productId}`;
            }
        }),
        getRatingCounts: builder.query({
            query: productId => {
                return `/reviews/getRatingCounts/${productId}`;
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