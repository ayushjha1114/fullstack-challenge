import { graphql, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor, within } from "@/test/renderWithProviders";
import { server } from "@/mocks/server";
import { db } from "@/mocks/db";
import { apolloClient } from "@/lib/apollo";
import { CarsPage } from "./CarsPage";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => apolloClient.clearStore());
afterEach(() => {
  server.resetHandlers();
  db.reset();
});
afterAll(() => server.close());

describe("CarsPage", () => {
  it("shows skeletons while loading, then the seeded cars", async () => {
    const { container } = renderWithProviders(<CarsPage />);

    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(6);

    await screen.findByText("Audi Q5");
    expect(screen.getByText("Audi R8")).toBeInTheDocument();
    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(0);
  });

  it("creates a car through the dialog and it appears in the list", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByText("Audi Q5");

    await user.click(screen.getByRole("button", { name: /add car/i }));
    const dialog = screen.getByRole("dialog");

    await user.type(within(dialog).getByLabelText(/make/i), "BMW");
    await user.type(within(dialog).getByLabelText(/model/i), "M3");
    await user.type(within(dialog).getByLabelText(/color/i), "Frozen Grey");
    await user.clear(within(dialog).getByLabelText(/year/i));
    await user.type(within(dialog).getByLabelText(/year/i), "2021");
    await user.click(within(dialog).getByRole("button", { name: /add car/i }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByText("BMW M3")).toBeInTheDocument();
  });

  it("rejects a blank make or model without submitting", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByText("Audi Q5");

    await user.click(screen.getByRole("button", { name: /add car/i }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /add car/i }));

    expect(within(dialog).getByText("Make is required")).toBeInTheDocument();
    expect(within(dialog).getByText("Model is required")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("filters by model server-side as the debounced search settles", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByText("Audi Q5");

    await user.type(screen.getByLabelText(/search model/i), "Q5");

    await waitFor(
      () => {
        expect(screen.queryByText("Audi A3")).not.toBeInTheDocument();
        expect(screen.getByText("Audi Q5")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows the empty state when nothing matches the filters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);
    await screen.findByText("Audi Q5");

    await user.type(screen.getByLabelText(/search model/i), "nonexistent");

    await waitFor(() => expect(screen.getByText("No cars found")).toBeInTheDocument(), {
      timeout: 3000,
    });
  });

  it("surfaces a server error with a retry button", async () => {
    server.use(
      graphql.query("GetCars", () =>
        HttpResponse.json({ errors: [{ message: "the inventory service is down" }] })
      )
    );

    renderWithProviders(<CarsPage />);

    expect(await screen.findByText("the inventory service is down")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});