import { useEffect, useState } from "react";

const useSocket = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const websocket = new WebSocket("ws://localhost:8081");

        setWs(websocket);
        console.log("Connected to WebSocket");
        websocket.onclose = () => {
            console.log("web socket removed")
            setWs(null)
        }

        // websocket.onmessage = function (event) {
        //     console.log("WebSocket message received");
        //     console.log("Message data:", event.data);
        // };
        websocket.onerror = (e) => {
            console.log("Error in WebSocket", e);
        };

        // Cleanup function to close the WebSocket when the component unmounts
        return () => {
            websocket.close();
            console.log("WebSocket closed");
        };
    }, []); // Empty dependency array means this effect runs only once on mount and cleanup on unmount

    return ws;
};

export default useSocket;
