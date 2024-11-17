import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
export const Chat = ({ roomId, messages, handleSendMessage }: any) => {
    const [message, setMessage] = useState('')






    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full max-w-full">
            <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-bold mb-2">Chat</h2>
                <span className="text-sm md:text-base">RoomId: {roomId}</span>
            </div>
            {/* Ensure ScrollArea has a max-height and overflow properties */}
            <div className="flex-grow mb-4 overflow-y-auto h-64"> {/* Set a height or max-height here */}
                <div className="pr-4">
                    {messages.map((msg: any, index: any) => (
                        <div key={index} className="mb-2 p-2 rounded-lg bg-gray-100">
                            <span className="font-bold text-blue-600">{msg.userId}: </span>
                            <span>{msg.message}</span>
                        </div>
                    ))}
                </div>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (message.trim()) {
                        handleSendMessage(message);
                        setMessage('');
                    }
                }}
                className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2"
            >
                <Input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow text-sm md:text-base"
                />
                <Button onClick={handleSendMessage} className="w-full md:w-auto">
                    Send
                </Button>
            </form>
        </div>


    )
}
