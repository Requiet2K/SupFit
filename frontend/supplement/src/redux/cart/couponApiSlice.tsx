import { apiSlice } from "../api/apiSlice"

export const couponApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        findCoupon: builder.query({
            query: code => {
                return `/coupon/findCoupon/${code}`;
            }
        }),
    })
})

export const {
    useLazyFindCouponQuery
} = couponApiSlice;