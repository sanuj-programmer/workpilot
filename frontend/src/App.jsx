import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Pending from './pages/Pending';
import Complete from './pages/Complete';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    background: {
      default: '#f7f7f7',
    },
  },
});

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    };
    setCurrentUser(user);
    navigate('/', { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route
          path="/login"
          element={
            <Box sx={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paper elevation={3} sx={{ p: 0, bgcolor: 'transparent', boxShadow: 'none' }}>
                <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
              </Paper>
            </Box>
          }
        />
        <Route
          path="/signup"
          element={
            <Box sx={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paper elevation={3} sx={{ p: 0, bgcolor: 'transparent', boxShadow: 'none' }}>
                <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
              </Paper>
            </Box>
          }
        />
        <Route
          element={
            currentUser
              ? <ProtectedLayout />
              : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pending" element={<Pending />} />
          <Route path="complete" element={<Complete />} />
          <Route
            path="profile"
            element={<Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />}
          />
        </Route>
        <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;