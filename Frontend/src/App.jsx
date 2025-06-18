import './styles/index.css'
import {Routes,Route} from 'react-router-dom'
import Auth from './pages/Auth'
import User from './pages/User'
import Driver from './pages/Driver'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Auth />} />
      <Route path='/user' element={<User />} />
      <Route path='/driver' element={<Driver />} />
     </Routes>
     <ToastContainer position="top-right" autoClose={2000}/>
    </>
  )
}

export default App
