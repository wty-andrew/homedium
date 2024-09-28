import { createRoot } from 'react-dom/client'

import App from './app.tsx'
import './assets/styles/main.css'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(<App />)
