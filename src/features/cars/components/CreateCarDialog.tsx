import { useState, type FormEvent } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { CREATE_CAR, GET_CARS, type CarsData, type CreateCarData, type NewCar } from "../api";

type CreateCarDialogProps = {
  open: boolean;
  onClose: () => void;
};

type FormErrors = Partial<Record<keyof NewCar, string>>;

const CURRENT_YEAR = new Date().getFullYear();

export function CreateCarDialog({ open, onClose }: CreateCarDialogProps) {
  const client = useApolloClient();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [color, setColor] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [createCar, { loading }] = useMutation<CreateCarData, { input: NewCar }>(CREATE_CAR);

  function reset() {
    setMake("");
    setModel("");
    setYear(String(CURRENT_YEAR));
    setColor("");
    setErrors({});
    setServerError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!make.trim()) next.make = "Make is required";
    if (!model.trim()) next.model = "Model is required";
    const parsedYear = Number(year);
    if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > CURRENT_YEAR + 1) {
      next.year = `Year must be between 1900 and ${CURRENT_YEAR + 1}`;
    }
    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const { data } = await createCar({
        variables: {
          input: {
            make: make.trim(),
            model: model.trim(),
            year: Number(year),
            ...(color.trim() ? { color: color.trim() } : {}),
          },
        },
      });

      const created = data?.createCar;
      if (!created) return;

      const existing = client.readQuery<CarsData>({ query: GET_CARS });
      client.writeQuery({
        query: GET_CARS,
        data: {
          cars: [
            { ...created, mobile: "", tablet: "", desktop: "" },
            ...(existing?.cars ?? []),
          ],
        },
      });

      setServerError(null);
      handleClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Something went wrong saving the car");
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add a car</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}
            <TextField
              label="Make"
              value={make}
              onChange={(event) => setMake(event.target.value)}
              error={Boolean(errors.make)}
              helperText={errors.make}
              autoFocus
              fullWidth
            />
            <TextField
              label="Model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              error={Boolean(errors.model)}
              helperText={errors.model}
              fullWidth
            />
            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              error={Boolean(errors.year)}
              helperText={errors.year}
              slotProps={{ htmlInput: { min: 1900, max: CURRENT_YEAR + 1 } }}
              fullWidth
            />
            <TextField
              label="Color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving…" : "Add car"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}