import './App.css'
import { Footer } from './components/NavbarAndFooter/Footer'
import HomePage from './components/HomePage.tsx/HomePage'
import {LoginPage} from './components/LoginPage/LoginPage'
import { Navbar } from './components/NavbarAndFooter/Navbar'
import { Route, Routes } from 'react-router-dom'
import { AccountPage } from './components/Account/AccountPage'
import { RequireAuth, RequireNonAuth } from './redux/auth/RequireAccess'

  function App() {
    

    return (
        <div className='d-flex flex-column min-vh-100'>
          <Navbar />
          <div className='flex-grow-1'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/home' element={<HomePage />} />
            <Route element={<RequireNonAuth />}>
              <Route path='/login' element={<LoginPage />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </Routes>
          </div>
          <Footer />
        </div>
    )
  }

  export default App
