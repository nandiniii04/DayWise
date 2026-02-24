import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function SummaryCard({ title, value, icon, color, subtitle, trend }) {
  return (
    <Card sx={{
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 32px ${color}22` },
    }}>
      <Box sx={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20, transparent)`,
      }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}18`, color, width: 44, height: 44, border: `1.5px solid ${color}30` }}>
            {icon}
          </Avatar>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, lineHeight: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            {trend === 'up' && <TrendingUp sx={{ fontSize: 14, color: '#4caf50' }} />}
            {trend === 'down' && <TrendingDown sx={{ fontSize: 14, color: '#f44336' }} />}
            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{subtitle}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}