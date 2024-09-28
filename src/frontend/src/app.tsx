import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import routes from './routes'
import { AuthProvider } from './contexts/auth'

const router = createBrowserRouter(routes)

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)

export default App
