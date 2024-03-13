import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import First from './components/Id-generatirpage/first'
import Inputlist from './components/input_list/inputlist'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  

  return (
    
     <BrowserRouter>
      <Routes>
        <Route path='/'  element={<First/>}></Route>
       <Route path="/list" element={<Inputlist/>}></Route>
       <Route path="/weather_detail" element={<First/>}></Route>
      </Routes>
      <ToastContainer theme="dark"/>
     </BrowserRouter>
     
  )
}

export default App
