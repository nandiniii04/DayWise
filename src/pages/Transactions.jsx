import { useState, useMemo } from 'react';
import {
  Box, Typography, Card, CardContent, Button, TextField,
  Table, TableBody, TableCell, TableHead, TableRow,
  Chip, Avatar, IconButton, Select, MenuItem, FormControl,
  InputLabel, Grid, Snackbar, Alert, InputAdornment, Tooltip
} from '@mui/material';
import {
  AddRounded, EditRounded, DeleteRounded, SearchRounded,
  ArrowUpwardRounded, ArrowDownwardRounded, FilterListRounded
} from '@mui/icons-material';
import { useTransactions } from '../context/TransactionContext';
import TransactionForm from '../components/TransactionForm';
import { formatCurrency, formatDate, ALL_CATEGORIES, CATEGORY_COLORS, MONTHS } from '../utils/categories';

export default function Transactions() {
  const { transactions, addTransaction, editTransaction, deleteTransaction } = useTransactions();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterType, setFilterType] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const filtered = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.title.toLowerCase().includes(search.toLowerCase()) ||
        tx.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = !filterCat || tx.category === filterCat;
      const txDate = new Date(tx.date);
      const matchMonth = !filterMonth || txDate.getMonth() === parseInt(filterMonth);
      const matchType = !filterType || tx.type === filterType;
      return matchSearch && matchCat && matchMonth && matchType;
    });
  }, [transactions, search, filterCat, filterMonth, filterType]);

  const handleAdd = (tx) => {
    addTransaction(tx);
    setSnack({ open: true, msg: 'Transaction added!', severity: 'success' });
  };

  const handleEdit = (tx) => {
    editTransaction(editing.id, tx);
    setEditing(null);
    setSnack({ open: true, msg: 'Transaction updated!', severity: 'success' });
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setSnack({ open: true, msg: 'Transaction deleted!', severity: 'error' });
  };

  const clearFilters = () => { setSearch(''); setFilterCat(''); setFilterMonth(''); setFilterType(''); };
  const hasFilters = search || filterCat || filterMonth || filterType;

  const selectStyle = {
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F5C518' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' },
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Transactions</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mt: 0.3 }}>
            {filtered.length} of {transactions.length} transactions
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRounded />} onClick={() => setFormOpen(true)}
          sx={{ background: 'linear-gradient(135deg, #F5C518, #e6b800)', color: '#1a1a1a', fontWeight: 700 }}>
          Add Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterListRounded sx={{ color: '#F5C518', fontSize: 18 }} />
            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Filters</Typography>
            {hasFilters && (
              <Button size="small" onClick={clearFilters}
                sx={{ ml: 'auto', color: '#F5C518', fontSize: '0.75rem' }}>
                Clear All
              </Button>
            )}
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth size="small" placeholder="Search..." value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#F5C518' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={selectStyle}>
                <InputLabel>Category</InputLabel>
                <Select value={filterCat} label="Category" onChange={e => setFilterCat(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  {ALL_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={selectStyle}>
                <InputLabel>Month</InputLabel>
                <Select value={filterMonth} label="Month" onChange={e => setFilterMonth(e.target.value)}>
                  <MenuItem value="">All Months</MenuItem>
                  {MONTHS.map((m, i) => <MenuItem key={m} value={String(i)}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" sx={selectStyle}>
                <InputLabel>Type</InputLabel>
                <Select value={filterType} label="Type" onChange={e => setFilterType(e.target.value)}>
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: 'text.secondary' }}>
                {hasFilters ? 'No matching transactions' : 'No transactions yet'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Transaction', 'Category', 'Date', 'Type', 'Amount', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', borderColor: 'divider' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(tx => (
                    <TableRow key={tx.id} sx={{
                      '&:hover': { background: 'rgba(245,197,24,0.03)' },
                      '&:last-child td': { border: 0 },
                    }}>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{
                            width: 36, height: 36,
                            bgcolor: tx.type === 'income' ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)',
                            color: tx.type === 'income' ? '#4caf50' : '#f44336',
                          }}>
                            {tx.type === 'income' ? <ArrowUpwardRounded sx={{ fontSize: 18 }} /> : <ArrowDownwardRounded sx={{ fontSize: 18 }} />}
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{tx.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Chip label={tx.category} size="small" sx={{
                          bgcolor: `${CATEGORY_COLORS[tx.category] || '#888'}18`,
                          color: CATEGORY_COLORS[tx.category] || '#888',
                          fontWeight: 600, fontSize: '0.7rem',
                        }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', color: 'text.secondary', borderColor: 'divider' }}>
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Chip
                          label={tx.type === 'income' ? 'Income' : 'Expense'}
                          size="small"
                          sx={{
                            bgcolor: tx.type === 'income' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                            color: tx.type === 'income' ? '#4caf50' : '#f44336',
                            fontWeight: 700, fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Typography sx={{
                          fontWeight: 700,
                          color: tx.type === 'income' ? '#4caf50' : '#f44336',
                          fontSize: '0.9rem',
                        }}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => setEditing(tx)}
                              sx={{ color: '#F5C518', '&:hover': { bgcolor: 'rgba(245,197,24,0.1)' } }}>
                              <EditRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(tx.id)}
                              sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(244,67,54,0.1)' } }}>
                              <DeleteRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
      <TransactionForm open={!!editing} onClose={() => setEditing(null)} onSubmit={handleEdit} initial={editing} />

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} onClose={() => setSnack({ ...snack, open: false })} sx={{ borderRadius: 2 }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}