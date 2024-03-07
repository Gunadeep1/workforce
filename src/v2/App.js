import React from 'react';
import { MyContext } from './Context';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LocalStorage from './utils/LocalStorage';
import { useEffect } from 'react';
import { useState } from 'react';
import Login from './layouts/login/Login';
import PrivateRoutes from './routes/PrivateRoutes';
import ForgotPassword from './layouts/forgotPassword/ForgotPassword';
import Home from './layouts/home/Home';
import SignUp from './layouts/signUp/SignUp';
import ReleaseNotes from './views/releaseNotes';
import OnboardEmployeeInvite from './views/employeeonBoard/OnboardEmployeeInvite';
import OnboardEmployeeUpload from './views/employeeonBoard/OnboardEmployeeUpload';

function App() {
  const [globaldata, setGlobaldata] = useState({
    logo_url: "",
    sales: false,
    bills: false
  });

  useEffect(() => {
    let userData = LocalStorage.getUserData();
    if (userData != null) {
      setGlobaldata((prev) => ({ ...prev, logo_url: userData.logo_url }));
    } else {
      setGlobaldata((prev) => ({ ...prev, logo_url: "" }));
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <MyContext.Provider value={{ globaldata, setGlobaldata }}>
        <BrowserRouter>
          {LocalStorage.getAccessToken() ? (
            <PrivateRoutes />
          ) : (
            <Routes>
              <Route path="/*" element={<Login />} />
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/onboard-invite-link/:id" element={<OnboardEmployeeInvite />} />
              <Route path="/onboard-employee-upload/:id" element={<OnboardEmployeeUpload />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/release-notes" element={<ReleaseNotes />} />
            </Routes>
          )}
          {/* <Routes>
            <Route path="/ReleaseNotes" element={<ReleaseNotes />} />
          </Routes> */}
        </BrowserRouter>
      </MyContext.Provider>
    </div>
  )
}

export default App
