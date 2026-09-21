import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { Car } from "../api";
import { CarImage } from "./CarImage";

export function CarCard({ car }: { car: Car }) {
  return (
    <Card variant="outlined">
      <CarImage car={car} alt={`${car.make} ${car.model}`} />
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography variant="h6" component="h3">
            {car.make} {car.model}
          </Typography>
          <Chip label={car.year} size="small" variant="outlined" />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {car.color}
        </Typography>
      </CardContent>
    </Card>
  );
}