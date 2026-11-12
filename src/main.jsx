import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.css'
import { initPrefs } from './extras.jsx'

initPrefs()
createRoot(document.getElementById('root')).render(<App />)
