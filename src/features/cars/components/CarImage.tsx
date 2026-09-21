import Box from "@mui/material/Box";
import type { Car } from "../api";

const MOBILE = "(max-width: 639px)";
const TABLET = "(min-width: 640px) and (max-width: 1023px)";

type CarImageProps = {
  car: Car;
  alt: string;
};

export function CarImage({ car, alt }: CarImageProps) {
  const src = car.desktop || car.mobile || car.tablet;

  if (!src) {
    return (
      <Box
        sx={{
          aspectRatio: "16 / 9",
          display: "grid",
          placeItems: "center",
          bgcolor: "grey.200",
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 1.5,
          fontSize: 12,
        }}
      >
        No photo
      </Box>
    );
  }

  return (
    <Box
      component="picture"
      sx={{ display: "block", width: "100%", "& img": { display: "block", width: "100%", height: "auto" } }}
    >
      <source media={MOBILE} srcSet={car.mobile} />
      <source media={TABLET} srcSet={car.tablet} />
      <img src={src} alt={alt} loading="lazy" />
    </Box>
  );
}