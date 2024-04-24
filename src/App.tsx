import Chat from './component/Chat';
import Navbar from './component/Navbar';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import {  Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
Amplify.configure(config);


function App() {

  

  return (
    <div>
      <Navbar/>
      <Routes>
      <Route path="/" Component={Chat} /> 
      <Route path = "chat/:conv" Component = {Chat} />
      </Routes>
      <Toaster position='bottom-right' />
    </div>
  )
}

const AppWithAuthenticator = withAuthenticator(App);

export default AppWithAuthenticator;
