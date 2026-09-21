import Box from "@mui/material/Box";
import type { Car } from "../api";
import { CarCard } from "./CarCard";

export function CarGrid({ cars }: { cars: Car[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
        gap: 3,
      }}
    >
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </Box>
  );
}