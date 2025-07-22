import { useState, useEffect } from "react"

import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Material UI imports
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { INPUTWRAPPER, BUTTON_CLASSES } from '../assets/dummy'
import { API_BASE_URL } from '../utils/api';
// Dummy data and repeated CSS
const INITIAL_FORM = { email: "", password: "" }

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  

  // Auto-login
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (token) {
      (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/user/me`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user })
            toast.success("Session restored. Redirecting...")
            navigate("/")
          } else {
            localStorage.clear()
          }
        } catch {
          localStorage.clear()
        }
      })()
    }
  }, [navigate, onSubmit])

  // useEffect(() => {
  //   console.log("Login form data changed:", formData)
  // }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()


    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!data.token) throw new Error(data.message || "Login failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      setFormData(INITIAL_FORM);
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      const msg = err.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
  }

  // Field definitions
  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ]

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 3, background: '#F5F6FA' }}>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <Box mb={6} textAlign="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #1976D2, #90CAF9)',
            borderRadius: '50%',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <LogIn style={{ width: 40, height: 40, color: '#fff' }} />
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#212121' }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" sx={{ color: '#1976D2', mt: 1 }}>
          Sign in to WorkPilot
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <Box key={name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Icon style={{ color: '#1976D2', width: 20, height: 20, marginRight: 8 }} />
            <TextField
              type={isPassword && !showPassword ? 'password' : type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              size="small"
              variant="outlined"
              fullWidth
              required
              InputProps={{
                style: { background: '#fff', color: '#212121' },
                endAdornment: isPassword && (
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <EyeOff style={{ width: 20, height: 20, color: '#1976D2' }} /> : <Eye style={{ width: 20, height: 20, color: '#1976D2' }} />}
                  </IconButton>
                )
              }}
              InputLabelProps={{ style: { color: '#B0BEC5' } }}
            />
          </Box>
        ))}


        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#1976D2',
            color: '#fff',
            '&:hover': { backgroundColor: '#1565C0' },
            boxShadow: 'none'
          }}
          startIcon={!loading && <LogIn style={{ width: 20, height: 20, color: '#fff' }} />}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>

      <Typography align="center" variant="body2" sx={{ color: '#212121', mt: 4 }}>
        Don't have an account?{' '}
        <Button
          type="button"
          onClick={handleSwitchMode}
          sx={{ textTransform: 'none', fontWeight: 500, color: '#1976D2' }}
        >
          Sign Up
        </Button>
      </Typography>
    </Paper>
  )
}

export default Login