import {
  TextField,
  IconButton,
  Grid
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

interface Props {

  index: number;

  line: {
    description: string;
    amount: number;
    currency: string;
  };

  onChange: (
    index: number,
    field: string,
    value: string
  ) => void;

  onRemove: (index: number) => void;
}

export default function InvoiceLineRow({
  index,
  line,
  onChange,
  onRemove
}: Props) {

  return (

    <Grid
      container
      spacing={2}
      sx={{ mb: 2, alignItems: 'center' }}
    >

      <Grid size={{ xs: 12, md: 5 }}>

        <TextField
          fullWidth
          label="Description"
          value={line.description}
          onChange={(e) =>
            onChange(
              index,
              'description',
              e.target.value
            )
          }
        />

      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>

        <TextField
          fullWidth
          type="number"
          label="Amount"
          value={line.amount}
          onChange={(e) =>
            onChange(
              index,
              'amount',
              e.target.value
            )
          }
        />

      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>

        <TextField
          fullWidth
          label="Currency"
          value={line.currency}
          onChange={(e) =>
            onChange(
              index,
              'currency',
              e.target.value
            )
          }
        />

      </Grid>

      <Grid size={{ xs: 12, md: 1 }}>

        <IconButton
          color="error"
          onClick={() => onRemove(index)}
        >
          <DeleteIcon />
        </IconButton>

      </Grid>

    </Grid>
  );
}