import './styles/index.css'
import {Routes,Route} from 'react-router-dom'
import Auth from './pages/Auth'
import User from './pages/User'
import Driver from './pages/Driver'

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Auth />} />
      <Route path='/user' element={<User />} />
      <Route path='/driver' element={<Driver />} />
     </Routes>
    </>
  )
}

export default App
