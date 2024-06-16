import { MessageState } from '../../types/messageType';
import { apiSlice } from '../api/apiSlice';

interface OutputResponse {
    output: string;
}

export const chatbotApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBotResponse: builder.query<OutputResponse, MessageState>({
            query: ({ chatId, message }) => ({
                url: `/api/v1/chat`,
                method: 'POST',
                body: {chatId, message}
            }),
        }),
    })
});

export const {
    useLazyGetBotResponseQuery
} = chatbotApiSlice;
