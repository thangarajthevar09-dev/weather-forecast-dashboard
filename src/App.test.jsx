import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import App from "./App";

const originalApiKey = process.env.VITE_WEATHER_API_KEY;
const originalFetch = global.fetch;

const mumbaiWeather = {
  cod: 200,
  name: "Mumbai",
  main: {
    temp: 31,
    feels_like: 32,
    temp_min: 30,
    temp_max: 32,
    pressure: 1009,
    humidity: 56,
  },
  weather: [
    {
      main: "Clouds",
      description: "overcast clouds",
      icon: "04d",
    },
  ],
  wind: {
    speed: 8,
    deg: 250,
  },
  sys: {
    country: "IN",
  },
};

describe("Weather Forecast Dashboard", () => {
  beforeEach(() => {
    process.env.VITE_WEATHER_API_KEY = "";

    global.fetch = jest.fn(async (url) => {
      if (
        String(url)
          .toLowerCase()
          .includes("invalidcity123")
      ) {
        return {
          ok: false,
          status: 404,
          json: async () => ({
            cod: "404",
            message: "city not found",
          }),
        };
      }

      return {
        ok: true,
        status: 200,
        json: async () => mumbaiWeather,
      };
    });
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.VITE_WEATHER_API_KEY;
    } else {
      process.env.VITE_WEATHER_API_KEY = originalApiKey;
    }

    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test("displays the city search box", () => {
    render(<App />);

    expect(
      screen.getByRole("textbox", {
        name: /search city/i,
      })
    ).toBeTruthy();
  });

  test("shows an error for an invalid city", async () => {
    render(<App />);

    const search = screen.getByRole("textbox", {
      name: /search city/i,
    });

    fireEvent.change(search, {
      target: {
        value: "InvalidCity123",
      },
    });

    fireEvent.submit(search.closest("form"));

    await waitFor(() => {
      expect(
        screen.getByRole("alert").textContent.toLowerCase()
      ).toMatch(
        /city not found|not found|unable to find|could not find/
      );
    });
  });

  test("displays the temperature for a supported city", async () => {
    render(<App />);

    const search = screen.getByRole("textbox", {
      name: /search city/i,
    });

    fireEvent.change(search, {
      target: {
        value: "Mumbai",
      },
    });

    fireEvent.submit(search.closest("form"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: "Mumbai",
        })
      ).toBeTruthy();

      expect(screen.getByText(/31/)).toBeTruthy();
    });
  });
});