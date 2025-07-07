import './App.css'
// import { ChessBoard } from './components/ChessBoard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import { NotFound } from './pages/NotFound';
function App() {


  return (
    <>
   <BrowserRouter>
          <Routes>
          <Route path="/" element={<LandingPage />} />
           <Route path="*" element={<NotFound />} />
       </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
