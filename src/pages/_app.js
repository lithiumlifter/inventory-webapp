import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return <Component {...pageProps} />
}
