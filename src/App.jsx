import { lazy, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, useToast } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'

const Chat = lazy(() => import('./Pages/Chat'))
const Layout = lazy(() => import('./Layout'))

function App() {

  const toast = useToast();
  const statusMap = {
    success: "success",
    danger: "error",
    warning: "warning",
    info: "info"
  };
  const showAlert = (message, type) => {

    toast({
      title: message,
      status: statusMap[type] || "error",
      duration: 4000,
      isClosable: true,
      position: 'top'
    })
  }
  return (
    <Routes>

      <Route path="/login" element={<Login showAlert={showAlert} />} />
      <Route path="/*" element={<Layout showAlert={showAlert} />}>
        <Route path="" element={<Chat showAlert={showAlert} />} />
        <Route path=":chat" element={<Chat showAlert={showAlert} />} />
      </Route>
    </Routes>
  )
}

export default App
