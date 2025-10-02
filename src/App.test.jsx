import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import * as ApiService from "./services/ApiService";

vi.mock("./services/ApiService");

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main heading", () => {
    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(() => {});

    render(<App />);
    expect(
      screen.getByText(/Welcome to the poetry database!/i)
    ).toBeInTheDocument();
  });

  it("renders SearchBar component", () => {
    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(() => {});

    render(<App />);
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it("calls fetchPoetData on mount", () => {
    const mockFetch = vi
      .spyOn(ApiService, "fetchPoetData")
      .mockImplementation(() => {});

    render(<App />);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("displays loading state", () => {
    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setLoading(true);
      }
    );

    render(<App />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("displays error message when error occurs", () => {
    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setError("Failed to fetch poems");
        setLoading(false);
      }
    );

    render(<App />);
    expect(screen.getByText(/Failed to fetch poems/i)).toBeInTheDocument();
  });

  it("displays poetry results when data is loaded", async () => {
    const mockData = [
      {
        title: "Test Poem",
        author: "Emily Dickinson",
        lines: ["Line 1", "Line 2"],
        linecount: 2,
      },
    ];

    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setData(mockData);
        setLoading(false);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Poem")).toBeInTheDocument();
    });
  });

  it("calls fetchPoetData when search button is clicked", async () => {
    const user = userEvent.setup();
    const mockFetch = vi
      .spyOn(ApiService, "fetchPoetData")
      .mockImplementation(() => {});

    render(<App />);

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(mockFetch).toHaveBeenCalledTimes(2); // Once on mount, once on click
  });

  it("shows poem details when More Details is clicked", async () => {
    const user = userEvent.setup();
    const mockData = [
      {
        title: "Test Poem",
        author: "Emily Dickinson",
        lines: ["Line 1", "Line 2"],
        linecount: 2,
      },
    ];

    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setData(mockData);
        setLoading(false);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Poem")).toBeInTheDocument();
    });

    const moreDetailsButton = screen.getByRole("button", {
      name: /more details/i,
    });
    await user.click(moreDetailsButton);

    expect(screen.getByText(/Poem Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Line Count: 2/i)).toBeInTheDocument();
  });

  it("returns to results when Back button is clicked", async () => {
    const user = userEvent.setup();
    const mockData = [
      {
        title: "Test Poem",
        author: "Emily Dickinson",
        lines: ["Line 1", "Line 2"],
        linecount: 2,
      },
    ];

    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setData(mockData);
        setLoading(false);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Poem")).toBeInTheDocument();
    });

    const moreDetailsButton = screen.getByRole("button", {
      name: /more details/i,
    });
    await user.click(moreDetailsButton);

    const backButton = screen.getByRole("button", { name: /back to results/i });
    await user.click(backButton);

    expect(screen.queryByText(/Poem Details/i)).not.toBeInTheDocument();
  });

  it("calls fetchPoetData with correct initial parameters on mount", () => {
    const mockFetch = vi
      .spyOn(ApiService, "fetchPoetData")
      .mockImplementation(() => {});

    render(<App />);

    expect(mockFetch).toHaveBeenCalledWith(
      "Emily Dickinson",
      undefined,
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("resets page number when search is performed", async () => {
    const user = userEvent.setup();
    const mockPoems = Array.from({ length: 10 }, (_, i) => ({
      title: `Poem ${i + 1}`,
      author: "Emily Dickinson",
      lines: ["Line 1"],
      linecount: 1,
    }));

    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setData(mockPoems);
        setLoading(false);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Poem 1")).toBeInTheDocument();
    });

    // Go to page 2
    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();

    // Perform new search
    const searchButton = screen.getByRole("button", { name: /^search$/i });
    await user.click(searchButton);

    // Should be back on page 1
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
    });
  });

  it("resets page number when randomize is clicked", async () => {
    const user = userEvent.setup();
    const mockPoems = Array.from({ length: 10 }, (_, i) => ({
      title: `Poem ${i + 1}`,
      author: "Emily Dickinson",
      lines: ["Line 1"],
      linecount: 1,
    }));

    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setData(mockPoems);
        setLoading(false);
      }
    );

    vi.spyOn(ApiService, "fetchRandomPoem").mockImplementation(
      (setData, setError, setLoading) => {
        setData(mockPoems);
        setLoading(false);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Poem 1")).toBeInTheDocument();
    });

    // Go to page 2
    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument();

    // Click randomize
    const randomButton = screen.getByRole("button", {
      name: /find for a random poem/i,
    });
    await user.click(randomButton);

    // Should be back on page 1
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
    });
  });

  it("calls fetchRandomPoem when randomize button is clicked", async () => {
    const user = userEvent.setup();
    const mockFetch = vi
      .spyOn(ApiService, "fetchPoetData")
      .mockImplementation(() => {});
    const mockRandomFetch = vi
      .spyOn(ApiService, "fetchRandomPoem")
      .mockImplementation(() => {});

    render(<App />);

    const randomButton = screen.getByRole("button", {
      name: /find for a random poem/i,
    });
    await user.click(randomButton);

    expect(mockRandomFetch).toHaveBeenCalledTimes(1);
    expect(mockRandomFetch).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("updates author and title inputs correctly", async () => {
    const user = userEvent.setup();
    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(() => {});

    render(<App />);

    const authorInput = screen.getByLabelText(/author/i);
    const titleInput = screen.getByLabelText(/title/i);

    await user.clear(authorInput);
    await user.type(authorInput, "Shakespeare");
    await user.type(titleInput, "Sonnet 18");

    expect(authorInput).toHaveValue("Shakespeare");
    expect(titleInput).toHaveValue("Sonnet 18");
  });

  it("displays poem author in details view", async () => {
    const user = userEvent.setup();
    const mockData = [
      {
        title: "Test Poem",
        author: "Emily Dickinson",
        lines: ["Line 1", "Line 2"],
        linecount: 2,
      },
    ];

    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setData(mockData);
        setLoading(false);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Poem")).toBeInTheDocument();
    });

    const moreDetailsButton = screen.getByRole("button", {
      name: /more details/i,
    });
    await user.click(moreDetailsButton);

    expect(screen.getByText(/Author: Emily Dickinson/i)).toBeInTheDocument();
  });

  it("displays poem lines in details view", async () => {
    const user = userEvent.setup();
    const mockData = [
      {
        title: "Test Poem",
        author: "Emily Dickinson",
        lines: ["First line of poem", "Second line of poem"],
        linecount: 2,
      },
    ];

    vi.spyOn(ApiService, "fetchPoetData").mockImplementation(
      (author, title, setData, setError, setLoading) => {
        setData(mockData);
        setLoading(false);
      }
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test Poem")).toBeInTheDocument();
    });

    const moreDetailsButton = screen.getByRole("button", {
      name: /more details/i,
    });
    await user.click(moreDetailsButton);

    expect(screen.getByText(/First line of poem/i)).toBeInTheDocument();
    expect(screen.getByText(/Second line of poem/i)).toBeInTheDocument();
  });
});
