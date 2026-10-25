
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("Weather Forecast Dashboard", () => {
  test("displays the city search box", () => {
    render(<App />);

    expect(
      screen.getByRole("textbox", { name: /search city/i }),
    ).toBeInTheDocument();
  });

  test("shows an error for an invalid city", async () => {
    render(<App />);

    fireEvent.change(screen.getByRole("textbox", { name: /search city/i }), {
      target: { value: "InvalidCityXYZ" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /search weather/i }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /city not found/i,
    );
  });

  test("displays the temperature for a supported city", async () => {
    render(<App />);

    fireEvent.change(screen.getByRole("textbox", { name: /search city/i }), {
      target: { value: "Mumbai" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /search weather/i }),
    );

    await waitFor(() => {
        expect(
        screen.getByRole("heading", { name: "Mumbai" }),
    ).toBeInTheDocument();

  expect(screen.getByText("31")).toBeInTheDocument();
    });
  });
});
