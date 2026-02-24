import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl, InputLabel,
  RadioGroup, FormControlLabel, Radio, FormLabel, Grid, Box, Typography, IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/categories';

const defaultForm = {
  title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], type: 'expense',
};

export default function TransactionForm({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm({ ...defaultForm, ...initial, amount: String(initial.amount) });
    else setForm(defaultForm);
    setErrors({});
  }, [initial, open]);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Valid amount required';
    if (!form.category) errs.category = 'Category required';
    if (!form.date) errs.date = 'Date required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: '#F5C518' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#F5C518' },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {initial ? 'Edit Transaction' : 'New Transaction'}
          </Typography>
          <IconButton onClick={onClose} size="small"><Close /></IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {/* Type */}
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend" sx={{ fontSize: '0.8rem', mb: 0.5, '&.Mui-focused': { color: '#F5C518' } }}>
              Transaction Type
            </FormLabel>
            <RadioGroup row value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: '' })}>
              <FormControlLabel value="income" control={
                <Radio sx={{ '&.Mui-checked': { color: '#4caf50' } }} />
              } label="Income" />
              <FormControlLabel value="expense" control={
                <Radio sx={{ '&.Mui-checked': { color: '#f44336' } }} />
              } label="Expense" />
            </RadioGroup>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Title" value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                error={!!errors.title} helperText={errors.title} sx={fieldStyle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Amount (₹)" type="number" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                error={!!errors.amount} helperText={errors.amount}
                inputProps={{ min: 0, step: '0.01' }} sx={fieldStyle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date" type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                error={!!errors.date} helperText={errors.date}
                InputLabelProps={{ shrink: true }} sx={fieldStyle} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.category} sx={fieldStyle}>
                <InputLabel>Category</InputLabel>
                <Select value={form.category} label="Category"
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  {categories.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
                {errors.category && <Typography sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 1.5 }}>{errors.category}</Typography>}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{
          background: 'linear-gradient(135deg, #F5C518, #e6b800)',
          color: '#1a1a1a', fontWeight: 700,
        }}>
          {initial ? 'Update' : 'Add Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}