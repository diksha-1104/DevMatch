import { useState } from 'react'
import { BrowserRouter , Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Body from './components/Body'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import Login from './components/Login'
import Feed from './components/Feed'
import Profile from './components/Profile'
import Connections from './components/Connections'
import Requests from './components/Requests'
import Signup from './components/Signup'
import Chat from './components/Chat'
import DeveloperSearch from './components/DeveloperSearch';

function App() {
  

  return (
    <>
    
    <Provider store={appStore}>
    
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/signup" element={<Signup />} ></Route>
       
        <Route path="/" element={<Body />} >

        <Route path="/" element={<Feed/>} />
         <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/feed" element={<Feed/>} />
          <Route path="/connections" element={<Connections/>} />
          <Route path="/requests" element={<Requests/>} />
          <Route path="/search" element={<DeveloperSearch/>} />
          <Route path="/chat/:targetUserId" element={<Chat/>} />
        
        </Route>
      </Routes>
    </BrowserRouter>

    </Provider>
   
      
    </>

  );
}

export default App
