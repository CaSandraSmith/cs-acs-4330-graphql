import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Home from "./components/Home/Home"
import Project from "./components/Project/Project";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<Project />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
