import { useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useTransactions } from '../context/TransactionContext';
import { CATEGORY_COLORS, MONTHS, formatCurrency } from '../utils/categories';
import { useThemeMode } from '../context/ThemeContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <Box sx={{
        background: 'rgba(26,26,26,0.95)',
        border: '1px solid rgba(245,197,24,0.2)',
        borderRadius: 2, p: 1.5,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}>
        <Typography sx={{ color: '#f0f0f0', fontWeight: 600, fontSize: '0.85rem' }}>
          {payload[0].name || payload[0].dataKey}
        </Typography>
        <Typography sx={{ color: '#F5C518', fontWeight: 700, fontSize: '0.9rem' }}>
          {formatCurrency(payload[0].value)}
        </Typography>
        {payload[1] && (
          <Typography sx={{ color: '#f44336', fontWeight: 700, fontSize: '0.9rem' }}>
            {formatCurrency(payload[1].value)}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

export default function Analytics() {
  const { transactions, totalIncome, totalExpense, balance } = useTransactions();
  const { mode } = useThemeMode();

  const gridColor = mode === 'dark' ? '#2a2a2a' : '#e0e0e0';
  const textColor = mode === 'dark' ? '#888' : '#666';

  // Expense by category (pie chart)
  const expensePieData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Monthly income vs expense (bar chart)
  const monthlyData = useMemo(() => {
    const map = {};
    MONTHS.forEach((m, i) => { map[i] = { month: m, income: 0, expense: 0 }; });
    transactions.forEach(t => {
      const month = new Date(t.date).getMonth();
      if (t.type === 'income') map[month].income += t.amount;
      else map[month].expense += t.amount;
    });
    return Object.values(map);
  }, [transactions]);

  // Income by category (pie)
  const incomePieData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === 'income').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const statCards = [
    { label: 'Net Balance', value: formatCurrency(balance), color: balance >= 0 ? '#4caf50' : '#f44336' },
    { label: 'Total Income', value: formatCurrency(totalIncome), color: '#4caf50' },
    { label: 'Total Expense', value: formatCurrency(totalExpense), color: '#f44336' },
    { label: 'Transactions', value: transactions.length, color: '#F5C518' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Analytics</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mt: 0.3 }}>
          Visual insights into your finances
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map(s => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ textAlign: 'center', p: 0 }}>
              <CardContent sx={{ py: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: s.color }}>
                  {s.value}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Monthly Bar Chart */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: 380 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Monthly Overview</Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} barCategoryGap="30%" barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false}
                      tickFormatter={v => v > 0 ? `₹${(v / 1000).toFixed(0)}k` : '0'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: textColor }} />
                    <Bar dataKey="income" name="Income" fill="#4caf50" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#f44336" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Pie Chart */}
        <Grid item xs={12} sm={6} lg={5}>
          <Card sx={{ height: 380 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Expense by Category</Typography>
              {expensePieData.length === 0 ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>No expense data yet</Typography>
                </Box>
              ) : (
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expensePieData} cx="50%" cy="45%" outerRadius={100}
                        dataKey="value" nameKey="name" paddingAngle={2}
                        label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                        labelLine={false}>
                        {expensePieData.map((entry, i) => (
                          <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#888'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11, color: textColor }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Income Pie Chart */}
        <Grid item xs={12} sm={6} lg={5}>
          <Card sx={{ height: 340 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Income by Source</Typography>
              {incomePieData.length === 0 ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>No income data yet</Typography>
                </Box>
              ) : (
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={incomePieData} cx="50%" cy="45%" innerRadius={55} outerRadius={90}
                        dataKey="value" nameKey="name" paddingAngle={3}>
                        {incomePieData.map((entry, i) => (
                          <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#4caf50'} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11, color: textColor }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Categories */}
        <Grid item xs={12} lg={7}>
          <Card sx={{ height: 340 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Top Expense Categories</Typography>
              {expensePieData.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                  <Typography sx={{ color: 'text.secondary' }}>No data yet</Typography>
                </Box>
              ) : (
                expensePieData
                  .sort((a, b) => b.value - a.value)
                  .slice(0, 5)
                  .map(item => {
                    const pct = totalExpense > 0 ? (item.value / totalExpense * 100).toFixed(1) : 0;
                    return (
                      <Box key={item.name} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</Typography>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{pct}%</Typography>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#f44336' }}>
                              {formatCurrency(item.value)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', overflow: 'hidden' }}>
                          <Box sx={{
                            height: '100%', borderRadius: 3,
                            width: `${pct}%`,
                            bgcolor: CATEGORY_COLORS[item.name] || '#f44336',
                            transition: 'width 0.8s ease',
                          }} />
                        </Box>
                      </Box>
                    );
                  })
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}