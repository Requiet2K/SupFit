import '../../style/Chatbox/Chatbox.css';
import chatbot from "../../images/chatbot.png";
import { useState } from 'react';
import { MessageState } from '../../types/messageType';
import { useLazyGetBotResponseQuery } from '../../redux/chatbot/chatboxApiSlice';

interface OutputResponse {
    output: string;
}

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    loading?: boolean;
};

export const Chatbox = () => {
    const [openChat, setOpenChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageIdCounter, setMessageIdCounter] = useState(0);
    const chatId = 2;
    const [input, setInput] = useState('');

    const handleChat = () => {
        setOpenChat(!openChat);
    }

    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage: Message = { id: messageIdCounter, text: input, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setMessageIdCounter(prevCounter => prevCounter + 1);
        const loadingMessage: Message = { id: messageIdCounter + 1, text: '', sender: 'bot', loading: true };
        setMessages(prevMessages => [...prevMessages, loadingMessage]);
        setMessageIdCounter(prevCounter => prevCounter + 2); 

        getBotResponse({ chatId, message: input }, loadingMessage.id);
        setInput('');
    }

    const [botResponseQuery] = useLazyGetBotResponseQuery();

    const getBotResponse = async (msg: MessageState, loadingMessageId: number) => {
        try {
            const response: OutputResponse = await botResponseQuery(msg).unwrap();
            setMessages(prevMessages => {
                const updatedMessages = prevMessages.map(msg =>
                    msg.id === loadingMessageId
                        ? { ...msg, text: response.output, loading: false }
                        : msg
                );
                return updatedMessages;
            });
        } catch (err: any) {
            console.log(err);
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== loadingMessageId));
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    }

    return (
        <div className='chatbot'>
            <div className={`chatbot-container ${openChat && "hide-chat-icon"}`} onClick={handleChat}>
                <img src={chatbot} alt="" />
                <span>Click to SupMate!</span>
            </div>
            <div className={`chatbot-body ${openChat ? "chatbot-open" : "chatbot-closed"}`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-left">
                        <img src={chatbot} alt="" />
                        <span>SupMate</span>
                    </div>
                    <div className="chatbot-header-right">
                        <i className="fa-solid fa-down-left-and-up-right-to-center" onClick={handleChat} />
                    </div>
                </div>
                <div className="chatbot-context">
                    {messages.map((message) => (
                        <div key={message.id} className={`message 
                            ${message.sender === 'bot' ? "justify-content-start" : "justify-content-end"}`}>
                            <div className={`message-sent ${message.sender}`}>
                                {message.loading ? (
                                    <div className="loading-indicator">
                                        {/* Loading spinner or custom div */}
                                        <div className="spinner"></div>
                                    </div>
                                ) : (
                                    message.text
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chatbot-msg">
                    <input
                        type="text"
                        placeholder='Type message...'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSend}>SEND</button>
                </div>
            </div>
        </div>
    );
}
