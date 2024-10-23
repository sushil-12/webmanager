import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthProvider.tsx';
import { QueryProvider } from './lib/react-query/QueryProvider.tsx';
import "../public/assets/themes/theme.css";
import UseTokenExpiration from './components/shared/UseTokenExpiration';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <UseTokenExpiration />
        <App />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>,
)
