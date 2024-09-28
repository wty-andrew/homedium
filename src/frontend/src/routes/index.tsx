import { Route, createRoutesFromElements } from 'react-router-dom'

import Home from './home'
import SignInCallback from './sign-in-callback'

export const routes = createRoutesFromElements(
  <Route path="/">
    <Route index element={<Home />} />
    <Route path="/signin/callback" element={<SignInCallback />} />
    <Route path="*" element={<div>Not Found</div>} />
  </Route>
)

export default routes
