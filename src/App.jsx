import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SignUpPage from "./pages/SignUpPage/SignUpPage.jsx";
import SignInPage from "./pages/SignInPage/SignInPage.jsx";
import UserOneGroup from "./pages/UserOneGroup/UserOneGroup.jsx";
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="signin" element={<SignInPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="users">
              {/* <Route index element={<UserPage />} /> */}
              <Route path=":userId/groups/:gpId" element={<UserOneGroup />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
export default App;