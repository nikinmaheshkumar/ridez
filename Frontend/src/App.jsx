import './styles/index.css'
import {Routes,Route} from 'react-router-dom'
import Auth from './pages/Auth'
import User from './pages/User'
import Driver from './pages/Driver'
import History from './components/User/History'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import JoinDriver from './components/User/JoinDriver'
import Requests from './components/Driver/Requests'
import DrivHistory from './components/Driver/DrivHistory'

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Auth />} />
      <Route path='/user' element={<User />} />
      <Route path='/history' element={<History />} />
      <Route path='/joindriver' element={<JoinDriver />} />
      <Route path='/driver' element={<Driver />} />
      <Route path='/drivhistory' element={<DrivHistory />} />
      <Route path='/requests' element={<Requests />} />
     </Routes>
     <ToastContainer position="top-right" autoClose={2000}/>
    </>
  )
}

export default App
