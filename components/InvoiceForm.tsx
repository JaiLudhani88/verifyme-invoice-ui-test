'use client';

import { useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import InvoiceLineRow from './InvoiceLineRow';

import { calculateInvoiceTotal } from '@/services/invoiceApi';

export default function InvoiceForm() {

  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('NZD');

  const [lines, setLines] = useState([
    {
      description: '',
      amount: 0,
      currency: ''
    }
  ]);

  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleLineChange = (
    index: number,
    field: string,
    value: string
  ) => {

    const updatedLines = [...lines];

    updatedLines[index] = {
      ...updatedLines[index],
      [field]:
        field === 'amount'
          ? Number(value)
          : value
    };

    setLines(updatedLines);
  };

  const addLine = () => {

    setLines([
      ...lines,
      {
        description: '',
        amount: 0,
        currency: ''
      }
    ]);
  };

  const removeLine = (index: number) => {

    const updatedLines =
      lines.filter((_, i) => i !== index);

    setLines(updatedLines);
  };

  const handleSubmit = async () => {

    setError('');
    setResult('');

    try {

      const payload = {
        invoice: {
          currency,
          date,
          lines
        }
      };

      const total =
        await calculateInvoiceTotal(payload);

      setResult(total);

    } catch (err: any) {

      setError(err.message);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 900,
        margin: '40px auto',
        padding: 2
      }}
    >
      <CardContent>

        <Typography
          variant="h4"
          gutterBottom
        >
          Multi Currency Invoice
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            type="date"
            label="Invoice Date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            slotProps={{
              inputLabel: {
                shrink: true
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Base Currency"
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
          />
        </Box>

        <Typography
          variant="h6"
          gutterBottom
        >
          Invoice Lines
        </Typography>

        {
          lines.map((line, index) => (
            <InvoiceLineRow
              key={index}
              index={index}
              line={line}
              onChange={handleLineChange}
              onRemove={removeLine}
            />
          ))
        }

        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addLine}
          >
            Add Line
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Calculate Total
          </Button>
        </Box>

        {
          result && (
            <Typography
              variant="h5"
              sx={{ mt: 3 }}
            >
              Total: {result}
            </Typography>
          )
        }

        {
          error && (
            <Typography
              color="error"
              sx={{ mt: 3 }}
            >
              {error}
            </Typography>
          )
        }

      </CardContent>
    </Card>
  );
}