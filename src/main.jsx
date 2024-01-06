import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './/context/store.js';
import { PrimeReactProvider } from 'primereact/api';
import { locale, addLocale } from 'primereact/api';
import esLocale from './assets/es.json';

import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';  

addLocale('es', esLocale);
locale('es');

import AppAuth from './AppAuth.jsx'
import AppUnauth from './AppUnauth.jsx'

// const RootComponent = () =>{
//     const { instance } = useMsal();
//     const activeAccount = instance.getActiveAccount();
    
//     return (
//       <>
//           <AuthenticatedTemplate>
//               {activeAccount ? (
//                   <Provider store={store}>
//                     <PrimeReactProvider>
//                       <AppAuth />
//                     </PrimeReactProvider>
//                   </Provider>
//               ) : null}
//           </AuthenticatedTemplate>
//           <UnauthenticatedTemplate>
//                   <Provider store={store}>
//                     <PrimeReactProvider>
//                       <AppUnauth />
//                     </PrimeReactProvider>
//                   </Provider>
//           </UnauthenticatedTemplate>
//       </>
//   );
// };

const RootComponent = () =>{
  return (
    <>
        <Provider store={store}>
          <PrimeReactProvider>
            <AppUnauth />
          </PrimeReactProvider>
        </Provider>
    </>
);
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <RootComponent />
)


