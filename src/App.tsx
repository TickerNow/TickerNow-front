import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react';

function App() {
  const {checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])

  return (
    <Routes>
      <Route path = "/" element = {<Home />}/>
    </Routes>
  )
}

export default App
