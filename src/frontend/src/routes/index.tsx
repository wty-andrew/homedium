import { Route, createRoutesFromElements } from 'react-router-dom'

import Home from './home'

export const routes = createRoutesFromElements(
  <Route path="/">
    <Route index element={<Home />} />
    <Route path="*" element={<div>Not Found</div>} />
  </Route>
)

export default routes
