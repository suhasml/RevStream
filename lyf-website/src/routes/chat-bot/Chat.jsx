import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid
// import LoaderDots from "./rive/RiveLoader";
import Loader from "components/ux/loader/loader";

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State to manage loader

    useEffect(() => {
        // Generate a unique conversation ID when the component mounts (for each user)
        setConversationId(uuidv4());
    }, []);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = async () => {
        if (!input) return;

        const newMessage = {
            conversation_id: conversationId,
            message: input,
            type: "text",
        };

        // Optimistically add the user's message to the chat
        setMessages([...messages, { ...newMessage, sender: "user" }]);

        setIsLoading(true); // Start loader while waiting for the bot's response

        // API call to send message
        try {
            const response = await fetch("YOUR_API_ENDPOINT", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMessage),
            });

            const data = await response.json();
            const botMessage = {
                conversation_id: data.conversation_id,
                message: data.message,
                type: data.message_type,
                sender: "bot",
            };

            // Add the bot's reply to the message list
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setIsLoading(false); // Stop loader after the bot's response
        setInput(""); // Clear input after sending
    };

    return (
        <div>
            {/* Island button to open chat */}
            <button
                className="fixed bottom-4 right-4 z-50 bg-black text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
                onClick={toggleChat}
            >
                Chat
            </button>

            {/* Overlay and larger chat window */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl h-[80%] md:h-[90%] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
                        <div className="bg-black text-white p-3 rounded-t-lg flex justify-between items-center">
                            <h4 className="font-semibold">LyfBot</h4>
                            <button onClick={toggleChat} className="text-xl">&times;</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`${msg.sender === "user"
                                            ? "text-right text-blue-600"
                                            : "text-left text-gray-800"
                                        }`}
                                >
                                    <span
                                        className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "user"
                                                ? "bg-blue-100"
                                                : "bg-gray-200"
                                            }`}
                                    >
                                        {msg.message}
                                    </span>
                                </div>
                            ))}

                            {/* Show loading animation if the bot is processing */}
                            {isLoading && (
                                <div className="flex justify-center items-center">
                                    {/* < LoaderDots /> */}
                                    <Loader />
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-300 flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
                                className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Type your message..."
                            />
                            <button
                                onClick={sendMessage}
                                className="ml-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
