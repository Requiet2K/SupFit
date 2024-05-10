import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './redux/store.tsx';
import { CombinedProvider } from './context/CombinedProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <CombinedProvider>
      <BrowserRouter>
        <Routes>
            <Route path='/*' element={<App />} />
        </Routes>
      </BrowserRouter>
    </CombinedProvider>
  </Provider>
)

