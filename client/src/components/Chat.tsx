import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
export const Chat = ({ roomId, messages, handleSendMessage }: any) => {
    const [message, setMessage] = useState('')

    const scrollAreaRef = useRef(null)





    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
            <div >

                <h2 className="text-2xl font-bold mb-4">Chat </h2>
                <span><span>RoomId:{roomId}</span></span>
            </div>
            <ScrollArea className="flex-grow mb-4 h-[calc(100%-6rem)]" ref={scrollAreaRef}>
                <div className="pr-4">
                    {messages.map((msg: any, index: any) => (
                        <div key={index} className="mb-2 p-2 rounded-lg bg-gray-100">
                            <span className="font-bold text-blue-600">{msg.userId}: </span>
                            <span>{msg.message}</span>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (message.trim()) {
                    handleSendMessage(message);
                    setMessage('');
                }
            }}>
                <div className="flex space-x-2">

                    <Input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                </div>
            </form>
        </div>
    )
}
