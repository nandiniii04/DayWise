import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import { LightMode, DarkMode, MenuRounded } from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { DRAWER_WIDTH } from './Sidebar';

export default function TopBar({ onMenuClick, title = 'Dashboard' }) {
  const { mode, toggle } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        background: mode === 'dark'
          ? 'rgba(15,15,15,0.95)'
          : 'rgba(244,244,240,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: mode === 'dark' ? '1px solid #1e1e1e' : '1px solid #e0e0e0',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ minHeight: 64, gap: 1 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, color: 'text.primary' }}
        >
          <MenuRounded />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
        </Box>

        <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
          <IconButton onClick={toggle} sx={{
            color: 'text.secondary',
            background: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            '&:hover': { background: 'rgba(245,197,24,0.1)', color: '#F5C518' },
          }}>
            {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}