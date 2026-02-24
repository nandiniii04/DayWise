import { useState } from 'react';
import {
  Grid, Box, Typography, Card, CardContent, Button,
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Avatar, Snackbar, Alert
} from '@mui/material';
import {
  AccountBalanceWalletRounded, TrendingUpRounded, TrendingDownRounded,
  SavingsRounded, AddRounded, ArrowUpwardRounded, ArrowDownwardRounded
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import SummaryCard from '../components/SummaryCard';
import TransactionForm from '../components/TransactionForm';
import { formatCurrency, formatDate, CATEGORY_COLORS } from '../utils/categories';

export default function Dashboard() {
  const { transactions, addTransaction, totalIncome, totalExpense, balance, savingsPercent } = useTransactions();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const handleAdd = (tx) => {
    addTransaction(tx);
    setSnack({ open: true, msg: 'Transaction added!', severity: 'success' });
  };

  const recent = transactions.slice(0, 6);

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box>
      {/* Greeting */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {getHour()}, {user?.name?.split(' ')[0]} 👋
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mt: 0.3 }}>
            Here's your financial overview
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => setFormOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #F5C518, #e6b800)',
            color: '#1a1a1a', fontWeight: 700,
            boxShadow: '0 4px 16px rgba(245,197,24,0.3)',
          }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Total Balance"
            value={formatCurrency(balance)}
            icon={<AccountBalanceWalletRounded />}
            color="#F5C518"
            subtitle={`As of ${new Date().toLocaleDateString('en-IN', { month: 'long' })}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={<TrendingUpRounded />}
            color="#4caf50"
            trend="up"
            subtitle="All time earnings"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Total Expense"
            value={formatCurrency(totalExpense)}
            icon={<TrendingDownRounded />}
            color="#f44336"
            trend="down"
            subtitle="All time spending"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <SummaryCard
            title="Savings Rate"
            value={`${savingsPercent}%`}
            icon={<SavingsRounded />}
            color="#00bcd4"
            subtitle={savingsPercent > 20 ? 'Great savings habit!' : 'Keep saving more'}
          />
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2.5, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Transactions</Typography>
            <Chip label={`${transactions.length} total`} size="small"
              sx={{ bgcolor: 'rgba(245,197,24,0.1)', color: '#F5C518', fontWeight: 600 }} />
          </Box>

          {recent.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
              <Typography sx={{ color: 'text.secondary', mb: 1 }}>No transactions yet</Typography>
              <Button variant="outlined" size="small" onClick={() => setFormOpen(true)}
                sx={{ borderColor: '#F5C518', color: '#F5C518' }}>
                Add your first transaction
              </Button>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Transaction', 'Category', 'Date', 'Amount'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', borderColor: 'divider' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recent.map(tx => (
                    <TableRow key={tx.id} sx={{ '&:hover': { background: 'rgba(245,197,24,0.03)' }, '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{
                            width: 32, height: 32,
                            bgcolor: tx.type === 'income' ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
                            color: tx.type === 'income' ? '#4caf50' : '#f44336',
                          }}>
                            {tx.type === 'income' ? <ArrowUpwardRounded sx={{ fontSize: 16 }} /> : <ArrowDownwardRounded sx={{ fontSize: 16 }} />}
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{tx.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Chip label={tx.category} size="small" sx={{
                          bgcolor: `${CATEGORY_COLORS[tx.category] || '#888'}18`,
                          color: CATEGORY_COLORS[tx.category] || '#888',
                          fontWeight: 600, fontSize: '0.7rem',
                        }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary', borderColor: 'divider' }}>
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Typography sx={{
                          fontWeight: 700, fontSize: '0.875rem',
                          color: tx.type === 'income' ? '#4caf50' : '#f44336',
                        }}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}