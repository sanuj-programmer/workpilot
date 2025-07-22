import { useState, useEffect } from "react"

import { UserPlus, Lock, Mail } from "lucide-react"
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import { API_BASE_URL } from '../utils/api';
const INITIAL_FORM = { name: "", email: "", password: "" }
const FIELDS = [
  {
    name: "name",
    type: "text",
    placeholder: "Name",
    icon: UserPlus,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    icon: Mail,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    icon: Lock,
  },
];

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: "", type: "" })

  useEffect(() => {
    console.log("SignUp form data changed:", formData)
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: "", type: "" })
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed.');
      console.log("SignUp successful:", data)
      setMessage({ text: "Registration successful! You can now log in.", type: "success" })
      setFormData(INITIAL_FORM)
    } catch (err) {
      console.error("SignUp error:", err)
      setMessage({ text: err.message || "An error occurred. Please try again.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 3, background: '#F5F6FA' }}>
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
          <UserPlus style={{ width: 40, height: 40, color: '#fff' }} />
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#212121' }}>
          Sign Up
        </Typography>
        <Typography variant="body2" sx={{ color: '#1976D2', mt: 1 }}>
        Work better, the smart way.
        </Typography>
      </Box>

      {message.text && (
        <Alert severity={message.type === "success" ? "success" : "error"} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <Box key={name} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Icon style={{ color: '#1976D2', width: 20, height: 20, marginRight: 8 }} />
            <TextField
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              size="small"
              variant="outlined"
              fullWidth
              required
              InputProps={{ style: { background: '#fff', color: '#212121' } }}
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
          startIcon={!loading && <UserPlus style={{ width: 20, height: 20, color: '#fff' }} />}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Box>

      <Typography align="center" variant="body2" sx={{ color: '#212121', mt: 4 }}>
        Already have an account?{' '}
        <Button
          type="button"
          onClick={onSwitchMode}
          sx={{ textTransform: 'none', fontWeight: 500, color: '#1976D2' }}
        >
          Login
        </Button>
      </Typography>
    </Paper>
  )
}

export default SignUp
