import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, IconButton, InputAdornment, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, LightMode, DarkMode } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

export default function Login() {
  const { login } = useAuth();
  const { mode, toggle } = useThemeMode();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('All fields required'); return; }
    try {
      setLoading(true);
      login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2D2D2D 50%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,197,24,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      },
    }}>
      <IconButton
        onClick={toggle}
        sx={{ position: 'absolute', top: 16, right: 16, color: '#F5C518' }}
      >
        {mode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Box sx={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #F5C518, #e6b800)',
            mb: 2,
            boxShadow: '0 8px 32px rgba(245,197,24,0.4)',
          }}>
            <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a' }}>D</Typography>
          </Box>
          <Typography variant="h4" sx={{
            color: '#F5C518',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            fontFamily: '"DM Sans", sans-serif',
          }}>
            DayWise
          </Typography>
          <Typography sx={{ color: '#888', mt: 0.5, fontSize: '0.9rem' }}>
            Smart Personal Finance Tracker
          </Typography>
        </Box>

        <Card sx={{
          background: 'rgba(26,26,26,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245,197,24,0.2)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 0.5, fontWeight: 700 }}>
              Welcome back
            </Typography>
            <Typography sx={{ color: '#666', mb: 3, fontSize: '0.875rem' }}>
              Sign in to your account
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                sx={{ mb: 2, ...inputStyle }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} sx={{ color: '#666' }}>
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, ...inputStyle }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #F5C518, #e6b800)',
                  color: '#1a1a1a',
                  fontWeight: 700,
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(245,197,24,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e6b800, #cc9f00)',
                    boxShadow: '0 6px 28px rgba(245,197,24,0.5)',
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: '#2a2a2a' }}>
              <Typography sx={{ color: '#555', fontSize: '0.8rem', px: 1 }}>OR</Typography>
            </Divider>

            <Typography sx={{ textAlign: 'center', color: '#888', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#F5C518', textDecoration: 'none', fontWeight: 600 }}>
                Create account
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: '#f0f0f0',
    '& fieldset': { borderColor: '#333' },
    '&:hover fieldset': { borderColor: '#F5C518' },
    '&.Mui-focused fieldset': { borderColor: '#F5C518' },
    background: 'rgba(255,255,255,0.03)',
  },
  '& .MuiInputLabel-root': { color: '#666' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' },
};