import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Game from "./components/Game"
import "./index.css"

function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>
          < Route path="/" element={<Home />} />
          < Route path="/game/:id" element={<Game />} />


        </Routes>



      </BrowserRouter>

    </>
  )
}

export default App
