import { render, screen } from "@testing-library/react";
import { CarImage } from "./CarImage";
import type { Car } from "../api";

const car: Car = {
  id: "1",
  make: "Audi",
  model: "Q5",
  year: 2023,
  color: "Glacier White",
  mobile: "/images/q5-mobile.svg",
  tablet: "/images/q5-tablet.svg",
  desktop: "/images/q5-desktop.svg",
};

describe("CarImage", () => {
  it("emits the three breakpoints as <source> elements with desktop as fallback", () => {
    const { container } = render(<CarImage car={car} alt="Audi Q5" />);

    const sources = container.querySelectorAll("picture source");
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute("media", "(max-width: 639px)");
    expect(sources[0]).toHaveAttribute("srcset", "/images/q5-mobile.svg");
    expect(sources[1]).toHaveAttribute("media", "(min-width: 640px) and (max-width: 1023px)");
    expect(sources[1]).toHaveAttribute("srcset", "/images/q5-tablet.svg");

    const img = screen.getByRole("img", { name: "Audi Q5" });
    expect(img).toHaveAttribute("src", "/images/q5-desktop.svg");
  });

  it("shows a placeholder instead of a broken image when URLs are missing", () => {
    render(<CarImage car={{ ...car, mobile: "", tablet: "", desktop: "" }} alt="Audi Q5" />);

    expect(screen.getByText("No photo")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});