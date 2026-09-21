import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import { SORT_OPTIONS, type SortKey } from "../sort";

type CarToolbarProps = {
  model: string;
  onModelChange: (value: string) => void;
  sort: SortKey;
  onSortChange: (key: SortKey) => void;
  onAddCar: () => void;
};

export function CarToolbar({
  model,
  onModelChange,
  sort,
  onSortChange,
  onAddCar,
}: CarToolbarProps) {
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" useFlexGap>
      <TextField
        label="Search model"
        placeholder="e.g. Q5"
        value={model}
        onChange={(event) => onModelChange(event.target.value)}
        size="small"
        sx={{ minWidth: 220, flexGrow: 1 }}
        slotProps={{
          input: {
            startAdornment: <SearchIcon fontSize="small" sx={{ color: "text.secondary", mr: 1 }} />,
          },
        }}
      />
      <TextField
        select
        label="Sort"
        value={sort}
        onChange={(event) => onSortChange(event.target.value as SortKey)}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.key} value={option.key}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ flexGrow: 1 }} />

      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddCar}>
        Add car
      </Button>
    </Stack>
  );
}