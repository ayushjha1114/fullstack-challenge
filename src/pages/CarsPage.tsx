import { useState } from "react";
import { Alert, Box, Button, Container, Skeleton, Stack, Typography } from "@mui/material";
import { useCars } from "@/features/cars/useCars";
import { useCarFilters } from "@/features/cars/useCarFilters";
import { sortCars } from "@/features/cars/sort";
import { CarGrid } from "@/features/cars/components/CarGrid";
import { CarToolbar } from "@/features/cars/components/CarToolbar";
import { CreateCarDialog } from "@/features/cars/components/CreateCarDialog";

function GridSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
        gap: 3,
      }}
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={220} />
      ))}
    </Box>
  );
}

export function CarsPage() {
  const { model, setModel, sort, setSort, filters } = useCarFilters();
  const { cars, loading, error, refetch } = useCars(filters);
  const [createOpen, setCreateOpen] = useState(false);

  const sortedCars = sortCars(cars, sort);

  const initialLoading = loading && cars.length === 0;

  const handleRetry = () => void refetch();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            Car inventory
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A small inventory UI on top of the mock GraphQL API.
          </Typography>
        </Stack>

        <CarToolbar
          model={model}
          onModelChange={setModel}
          sort={sort}
          onSortChange={setSort}
          onAddCar={() => setCreateOpen(true)}
        />

        {error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {error.message}
          </Alert>
        ) : initialLoading ? (
          <GridSkeleton />
        ) : sortedCars.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No cars found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {model ? "Try clearing the filters." : "Add your first car to get started."}
            </Typography>
          </Box>
        ) : (
          <CarGrid cars={sortedCars} />
        )}

        <CreateCarDialog open={createOpen} onClose={() => setCreateOpen(false)} />
      </Stack>
    </Container>
  );
}