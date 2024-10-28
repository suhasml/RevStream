import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Loader from "components/ux/loader/loader";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ReactMarkdown from "react-markdown";

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [conversationId, setConversationId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    useEffect(() => {
        setConversationId(uuidv4());
    }, []);

    useEffect(() => {
        if (transcript && !listening) {
            handleSendMessage(transcript); 
        }
    }, [transcript, listening]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now(),
            conversation_id: conversationId,
            message: message.trim(),
            sender: "user",
        };
        setMessages((prev) => [...prev, userMessage]);

        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8002/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message.trim(),
                    session_id: conversationId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const botResponse = await response.text();

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    conversation_id: conversationId,
                    message: botResponse,
                    sender: "bot",
                },
            ]);
        } catch (error) {
            console.error("Error in chat:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    conversation_id: conversationId,
                    message: "Sorry, there was an error processing your message. Please try again.",
                    sender: "bot",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(input);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
            setIsListening(false);
        } else {
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true, language: "en-US" });
            setIsListening(true);
        }
    };

    // Check if browser supports speech recognition
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <div>Speech Recognition is not supported by your browser.</div>;
    }

    return (
        <div>
            <button
                className="fixed bottom-4 right-4 z-50 bg-black text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition"
                onClick={toggleChat}
                aria-label="Toggle chat"
            >
                Chat
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md md:max-w-2xl lg:max-w-3xl h-[80%] md:h-[90%] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-black text-white p-3 rounded-t-lg flex justify-between items-center">
                            <h4 className="font-semibold">LyfBot</h4>
                            <button 
                                onClick={toggleChat}
                                className="text-xl hover:text-gray-300 transition"
                                aria-label="Close chat"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        msg.sender === "user" 
                                            ? "justify-end" 
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                            msg.sender === "user"
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-gray-200 text-gray-800"
                                        }`}
                                    >
                                        {msg.sender === "bot" ? (
                                            <ReactMarkdown>{msg.message}</ReactMarkdown>
                                        ) : (
                                            msg.message
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-gray-300">
                            {isLoading && (
                                <div className="flex justify-center items-center mb-2">
                                    <Loader />
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => handleSendMessage(input)}
                                    className={`bg-black text-white px-4 py-2 rounded-lg transition ${
                                        isLoading 
                                            ? "opacity-50 cursor-not-allowed" 
                                            : "hover:bg-blue-600"
                                    }`}
                                    disabled={isLoading}
                                >
                                    Send
                                </button>
                                <button
                                    onClick={toggleListening}
                                    className={`${
                                        isListening
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                    } text-white px-4 py-2 rounded-lg transition ${
                                        isLoading 
                                            ? "opacity-50 cursor-not-allowed" 
                                            : "hover:bg-green-600"
                                    }`}
                                    disabled={isLoading}
                                >
                                    {isListening ? "🎙️ Stop" : "🎤 Start"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;