import '../styles/globals.scss';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // Only import bootstrap if document is defined:
  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
}, [])

  return <Component {...pageProps} />
}

export default MyApp
