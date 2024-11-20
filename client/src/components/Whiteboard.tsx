import { useEffect } from "react";
import { Pencil, Eraser, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

export const Whiteboard = ({
    setIsOverlayOpen,
    winner,
    Turnword,
    isOpen,
    clear,
    word,
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
}: any) => {
    useEffect(() => {
        if (isOpen) {
            const timeout = setTimeout(() => {
                setIsOverlayOpen(false);
            }, 4000);

            return () => clearTimeout(timeout);
        }
    }, [isOpen, setIsOverlayOpen]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full max-w-full">
            <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
                <h2 className="text-xl md:text-2xl font-bold">Whiteboard</h2>
                <div className="text-xl md:text-2xl font-bold">
                    Word: {word ? word : "********"}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4 md:h-6 md:w-6" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Eraser className="h-4 w-4 md:h-6 md:w-6" />
                    </Button>
                    <Button onClick={clear} variant="outline" size="icon">
                        <Trash2 className="h-4 w-4 md:h-6 md:w-6" />
                    </Button>
                </div>
            </div>
            <div className="relative flex-grow bg-gray-100 rounded-lg overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={600}
                    style={{ border: "1px solid black", width: "100%", height: "100%" }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-lg font-bold"
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 300, opacity: 0 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-4xl md:text-5xl font-extrabold text-yellow-400 shadow-lg"
                                >
                                    🎉 Winner of this Round is {winner}! 🎉
                                </motion.div>
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-3xl md:text-4xl font-bold text-pink-500 mt-2"
                                >
                                    The word was: <span className="italic text-teal-300">{Turnword}</span>
                                </motion.div>
                                <motion.div
                                    className="mt-4 text-lg text-white font-bold animate-bounce"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1, delay: 1 }}
                                >
                                    🎨 Keep drawing! 🎨
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
