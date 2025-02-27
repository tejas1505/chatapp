import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ContextProvider } from './Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <ChakraProvider>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ChakraProvider>
    </Router>
  </StrictMode>,
)
