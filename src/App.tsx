import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react';
import AdminHome from './pages/Admin';
import NotFound from './pages/NotFound';
import AdminRoute from './route/AdminRoute';

function App() {
  const {checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])

  return (
    <Routes>
      <Route path = "/" element = {<Home />}/>
      <Route path = "/admin" element = {
        <AdminRoute>
          <AdminHome />
        </AdminRoute>
        }/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
