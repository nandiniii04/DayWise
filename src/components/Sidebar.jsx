import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, Box, Typography, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Avatar, Divider, Chip
} from '@mui/material';
import {
  DashboardRounded, ReceiptLongRounded, BarChartRounded,
  LogoutRounded
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardRounded />, path: '/dashboard' },
  { label: 'Transactions', icon: <ReceiptLongRounded />, path: '/transactions' },
  { label: 'Analytics', icon: <BarChartRounded />, path: '/analytics' },
];

export default function Sidebar({ open, onClose, variant = 'permanent' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px',
            background: 'linear-gradient(135deg, #F5C518, #e6b800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(245,197,24,0.3)',
          }}>
            <Typography sx={{ fontWeight: 900, color: '#1a1a1a', fontSize: 18 }}>D</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'text.primary', lineHeight: 1.1 }}>DayWise</Typography>
            <Typography sx={{ fontSize: '0.65rem', color: '#F5C518', fontWeight: 500 }}>FINANCE TRACKER</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
          borderRadius: 2, background: 'rgba(245,197,24,0.06)',
          border: '1px solid rgba(245,197,24,0.1)',
        }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#F5C518', color: '#1a1a1a', fontWeight: 700, fontSize: 14 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ px: 1.5, flexGrow: 1 }}>
        <Typography sx={{ px: 1, pb: 1, fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', letterSpacing: '0.08em' }}>
          MENU
        </Typography>
        <List disablePadding>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => { navigate(item.path); if (onClose) onClose(); }}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    background: active ? 'rgba(245,197,24,0.12)' : 'transparent',
                    border: active ? '1px solid rgba(245,197,24,0.2)' : '1px solid transparent',
                    '&:hover': { background: 'rgba(245,197,24,0.08)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: active ? '#F5C518' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? '#F5C518' : 'text.primary',
                    }}
                  />
                  {active && <Chip label="●" size="small" sx={{ height: 8, width: 8, '& .MuiChip-label': { p: 0 }, bgcolor: '#F5C518', borderRadius: '50%' }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'divider', mx: 2 }} />

      {/* Logout */}
      <Box sx={{ p: 1.5, pb: 2 }}>
        <ListItemButton onClick={handleLogout} sx={{
          borderRadius: 2, py: 1.2, color: 'error.main',
          '&:hover': { background: 'rgba(244,67,54,0.08)' },
        }}>
          <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
            <LogoutRounded />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer open={open} onClose={onClose} variant="temporary"
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer variant="permanent"
      sx={{ width: DRAWER_WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}>
      {content}
    </Drawer>
  );
}