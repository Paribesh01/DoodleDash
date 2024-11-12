import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import "./index.css"
import Playground from "./components/PlayGround"

function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>
          < Route path="/" element={<Home />} />
          < Route path="/game/:id" element={<Playground />} />


        </Routes>



      </BrowserRouter>

    </>
  )
}

export default App
