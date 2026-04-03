import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StoreContextProvider } from './Context/AuthContext/AuthContext'
import { BrowserRouter } from "react-router-dom"
import { ChatProvider } from './Context/ChatContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </StoreContextProvider>
  </BrowserRouter>
)
