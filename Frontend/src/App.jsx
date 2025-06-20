import './styles/index.css'
import {Routes,Route} from 'react-router-dom'
import Auth from './pages/Auth'
import User from './pages/User'
import Driver from './pages/Driver'
import History from './components/User/History'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import JoinDriver from './components/User/JoinDriver'

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Auth />} />
      <Route path='/user' element={<User />} />
      <Route path='/history' element={<History />} />
      <Route path='/joindriver' element={<JoinDriver />} />
      <Route path='/driver' element={<Driver />} />
     </Routes>
     <ToastContainer position="top-right" autoClose={2000}/>
    </>
  )
}

export default App
