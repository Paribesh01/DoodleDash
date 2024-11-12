import { Pencil, Eraser, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const Whiteboard = ({ clear, word, canvasRef, startDrawing, draw, stopDrawing }: any) => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Whiteboard</h2>
                <div className="text-2xl font-bold">
                    Word: {word ? word : "********"}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Eraser className="h-4 w-4" />
                    </Button>
                    <Button onClick={clear} variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex-grow bg-gray-100 rounded-lg">
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={600}
                    style={{ border: "1px solid black" }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                />            </div>
        </div>
    )
}