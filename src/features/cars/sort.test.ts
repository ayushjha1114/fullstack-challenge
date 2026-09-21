import { sortCars } from "./sort";
import type { Car } from "./api";

function car(partial: Partial<Car> & Pick<Car, "id" | "model" | "year">): Car {
  return {
    make: "Audi",
    color: "White",
    mobile: "/m.svg",
    tablet: "/t.svg",
    desktop: "/d.svg",
    ...partial,
  };
}

describe("sortCars", () => {
  const cars = [
    car({ id: "1", model: "Q5", year: 2023 }),
    car({ id: "2", model: "A3", year: 2022 }),
    car({ id: "3", model: "Q3", year: 2024 }),
  ];

  it("sorts newest year first as the default", () => {
    expect(sortCars(cars, "year_desc").map((c) => c.id)).toEqual(["3", "1", "2"]);
  });

  it("sorts oldest year first", () => {
    expect(sortCars(cars, "year_asc").map((c) => c.id)).toEqual(["2", "1", "3"]);
  });

  it("sorts by model alphabetically", () => {
    expect(sortCars(cars, "model_asc").map((c) => c.model)).toEqual(["A3", "Q3", "Q5"]);
  });

  it("does not mutate the input array", () => {
    const input = [...cars];
    sortCars(input, "year_desc");
    expect(input).toEqual(cars);
  });
});