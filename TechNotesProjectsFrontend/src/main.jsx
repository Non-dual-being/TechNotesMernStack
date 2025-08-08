import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { store } from './app/Store.js'
import { Provider } from 'react-redux'
import disableReactDevTools from './config/devTools/disableDevTools';

disableReactDevTools();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<App />}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)

/***
 * Provider maakt de store beschikbaar in je componenten structuur
 * Useselector en dispatch worden mogelijk gemaakt doordat de store van de provider zichtbaar wordt gemaakt
 */