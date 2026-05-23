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

const VALID_CURRENCIES = [
  'USD',
  'NZD',
  'AUD',
  'INR',
  'EUR',
  'GBP',
  'JPY',
  'SGD'
];

type InvoiceLine = {
  description: string;
  amount: number;
  currency: string;
};

type LineError = {
  description?: string;
  amount?: string;
  currency?: string;
};

export default function InvoiceForm() {

  const [date, setDate] = useState('');
  const [currency, setCurrency] = useState('NZD');

  const [baseCurrencyError, setBaseCurrencyError] =
    useState('');

  const [lines, setLines] = useState<InvoiceLine[]>([
    {
      description: '',
      amount: 0,
      currency: ''
    }
  ]);

  const [lineErrors, setLineErrors] =
    useState<LineError[]>([{}]);

  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const validateBaseCurrency = (
    value: string
  ): string => {

    if (!VALID_CURRENCIES.includes(value.toUpperCase())) {
      return 'Invalid base currency';
    }

    return '';
  };

  const validateLine = (
    line: InvoiceLine
  ): LineError => {

    const errors: LineError = {};

    // Description validation
    if (!line.description.trim()) {

      errors.description =
        'Description is required';

    } else if (
      !/^[a-zA-Z0-9\s.,-]+$/.test(
        line.description
      )
    ) {

      errors.description =
        'Description should contain valid text only';
    }

    // Amount validation
    if (
      isNaN(line.amount) ||
      line.amount <= 0
    ) {

      errors.amount =
        'Amount should be a valid number greater than 0';
    }

    // Currency validation
    if (
      !VALID_CURRENCIES.includes(
        line.currency.toUpperCase()
      )
    ) {

      errors.currency =
        'Invalid currency';
    }

    return errors;
  };

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

    // Validate updated row
    const updatedErrors = [...lineErrors];

    updatedErrors[index] =
      validateLine(updatedLines[index]);

    setLineErrors(updatedErrors);
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

    setLineErrors([
      ...lineErrors,
      {}
    ]);
  };

  const removeLine = (index: number) => {

    const updatedLines =
      lines.filter((_, i) => i !== index);

    const updatedErrors =
      lineErrors.filter((_, i) => i !== index);

    setLines(updatedLines);
    setLineErrors(updatedErrors);
  };

  const validateAll = (): boolean => {

    let valid = true;

    // Validate base currency
    const baseError =
      validateBaseCurrency(currency);

    setBaseCurrencyError(baseError);

    if (baseError) {
      valid = false;
    }

    // Validate all lines
    const errors = lines.map((line) => {

      const lineError =
        validateLine(line);

      if (
        Object.keys(lineError).length > 0
      ) {

        valid = false;
      }

      return lineError;
    });

    setLineErrors(errors);

    return valid;
  };

  const handleSubmit = async () => {

    setError('');
    setResult('');

    const isValid = validateAll();

    if (!isValid) {
      return;
    }

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

      setError(
        err.message ||
        'Something went wrong'
      );
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
            onChange={(e) => {

              const value =
                e.target.value.toUpperCase();

              setCurrency(value);

              setBaseCurrencyError(
                validateBaseCurrency(value)
              );
            }}
            error={!!baseCurrencyError}
            helperText={baseCurrencyError}
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
