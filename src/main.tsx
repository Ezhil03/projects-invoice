import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Invoicebuilder from './Invoicebuilder.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Invoicebuilder/>
  </StrictMode>,
)
