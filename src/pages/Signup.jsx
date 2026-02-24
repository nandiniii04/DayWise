import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, IconButton, InputAdornment, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, LightMode, DarkMode } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

export default function Signup() {
  const { signup } = useAuth();
  const { mode, toggle } = useThemeMode();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    try {
      setLoading(true);
      signup(form.name, form.email, form.password);
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
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,197,24,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      },
    }}>
      <IconButton onClick={toggle} sx={{ position: 'absolute', top: 16, right: 16, color: '#F5C518' }}>
        {mode === 'dark' ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Box sx={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64, borderRadius: '16px',
            background: 'linear-gradient(135deg, #F5C518, #e6b800)',
            mb: 2, boxShadow: '0 8px 32px rgba(245,197,24,0.4)',
          }}>
            <Typography sx={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a' }}>D</Typography>
          </Box>
          <Typography variant="h4" sx={{ color: '#F5C518', fontWeight: 800 }}>DayWise</Typography>
          <Typography sx={{ color: '#888', mt: 0.5, fontSize: '0.9rem' }}>Start your financial journey</Typography>
        </Box>

        <Card sx={{
          background: 'rgba(26,26,26,0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(245,197,24,0.2)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 0.5, fontWeight: 700 }}>Create account</Typography>
            <Typography sx={{ color: '#666', mb: 3, fontSize: '0.875rem' }}>Join DayWise today</Typography>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth label="Full Name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                sx={{ mb: 2, ...inputStyle }} />
              <TextField fullWidth label="Email Address" type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                sx={{ mb: 2, ...inputStyle }} />
              <TextField
                fullWidth label="Password"
                type={showPass ? 'text' : 'password'} value={form.password}
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
                sx={{ mb: 2, ...inputStyle }} />
              <TextField fullWidth label="Confirm Password" type="password" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                sx={{ mb: 3, ...inputStyle }} />
              <Button type="submit" fullWidth variant="contained" disabled={loading}
                sx={{
                  py: 1.5, fontSize: '1rem',
                  background: 'linear-gradient(135deg, #F5C518, #e6b800)',
                  color: '#1a1a1a', fontWeight: 700, borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(245,197,24,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #e6b800, #cc9f00)' },
                }}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: '#2a2a2a' }}>
              <Typography sx={{ color: '#555', fontSize: '0.8rem', px: 1 }}>OR</Typography>
            </Divider>

            <Typography sx={{ textAlign: 'center', color: '#888', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#F5C518', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
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