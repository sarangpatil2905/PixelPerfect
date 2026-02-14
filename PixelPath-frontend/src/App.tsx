import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import  AppProviders  from './providers'

function App() {

  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
