import './App.css'
import { Footer } from './components/NavbarAndFooter/Footer'
import HomePage from './components/HomePage.tsx/HomePage'
import {LoginPage} from './components/LoginPage/LoginPage'
import { Navbar } from './components/NavbarAndFooter/Navbar'
import { Route, Routes } from 'react-router-dom'
import { RequireAuth, RequireNonAuth } from './redux/auth/RequireAccess'
import { Dashboard } from './components/Account/layout/Account/Dashboard'
import { Information } from './components/Account/layout/Account/Information'
import { Security } from './components/Account/layout/Account/Security'
import { CurrentOrder } from './components/Account/layout/CurrentOrder'
import { PastOrder } from './components/Account/layout/PastOrder'
import { Favorites } from './components/Account/layout/Favorites'
import { Box } from './components/Account/layout/Box'
import { Addresses } from './components/Account/layout/Addresses'
import { Comments } from './components/Account/layout/Comments'
import { Faqs } from './components/Account/layout/Faqs'
import { useState } from 'react'

function App() {

    const [showContactModal, setShowContactModal] = useState(false);

    const handleContactModal = () => {
      setShowContactModal(true);
    }

    const handleCloseContactModal = () => {
      setShowContactModal(false);
    }

    return (
        <div className='d-flex flex-column min-vh-100'>
          <Navbar />
          <div className='flex-grow-1 contentItems'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/home' element={<HomePage />} />
            <Route element={<RequireNonAuth />}>
              <Route path='/login' element={<LoginPage />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/account" element={<Dashboard />} />
              <Route path="/order" element={<CurrentOrder />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/information" element={<Information />} />
              <Route path="/security" element={<Security />} />
              <Route path="/current-orders" element={<CurrentOrder />} />
              <Route path="/past-orders" element={<PastOrder />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/box" element={<Box />} />
              <Route path="/addresses" element={<Addresses />} />
              <Route path="/comments" element={<Comments />} />
              <Route path="/faqs" element={<Faqs handleContactModal={handleContactModal}/>} />
            </Route>
          </Routes>
          </div>
          <Footer handleContactModal={showContactModal} handleCloseContactModal={handleCloseContactModal}/>
        </div>
    )
  }

  export default App
