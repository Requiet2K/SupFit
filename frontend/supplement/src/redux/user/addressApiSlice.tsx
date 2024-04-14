import { AddressState, sendAddressState } from "../../types/loginTypes";
import { apiSlice } from "../api/apiSlice"

export const addressApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        deleteAddress: builder.mutation({
            query: id => ({
                url: `/address/deleteAddress/${id}`,
                method: 'DELETE',
            }),
        }),
        setAddressDefault: builder.mutation({
            query: id => ({
                url: `/address/setAddressDefault/${id}`,
                method: 'PUT',
            }),
        }),
        createAddress: builder.mutation({
            query: ({id, credentials}: {id: number, credentials: sendAddressState}) => ({
                url: `/address/createAddress/${id}`,
                method: 'POST',
                body: {...credentials}
            })
        }),
        updateAddress: builder.mutation({
            query: ({id, credentials}: {id: number, credentials: AddressState}) => ({
                url: `address/updateAddress/${id}`,
                method: 'PUT',
                body: {...credentials}
            })
        })
    })
})

export const {
    useDeleteAddressMutation,
    useSetAddressDefaultMutation,
    useCreateAddressMutation,
    useUpdateAddressMutation
} = addressApiSlice;