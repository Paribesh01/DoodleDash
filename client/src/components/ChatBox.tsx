import { useState, useRef, useEffect } from 'react';


export default function ChatBox({ messages, handleSendMessage, userid }: any) {
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="flex mt-9 flex-col h-[500px] max-w-md mx-auto border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4 border-b border-gray-300">
                <h2 className="text-lg font-semibold">Chat Box</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((message: any) => (
                        <div
                            key={message.id}
                            className={`flex ${message.userId === userid ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${message.userId === userid
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-gray-800'
                                    }`}
                            >
                                {message.message}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No messages</div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={(e) => {
                e.preventDefault(); // Prevent the default form submission
                if (inputMessage.trim()) { // Check if the input is not empty
                    handleSendMessage(inputMessage); // Call the send message function
                    setInputMessage(''); // Clear the input field
                }
            }} className="bg-white p-4 border-t border-gray-300">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}