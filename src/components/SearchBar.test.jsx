import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  it("renders author and title inputs", () => {
    const mockSetAuthor = vi.fn();
    const mockSetTitle = vi.fn();
    const mockOnSearch = vi.fn();

    render(
      <SearchBar
        author=""
        setAuthor={mockSetAuthor}
        title=""
        setTitle={mockSetTitle}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("displays the current author value", () => {
    const mockSetAuthor = vi.fn();
    const mockSetTitle = vi.fn();
    const mockOnSearch = vi.fn();

    render(
      <SearchBar
        author="Emily Dickinson"
        setAuthor={mockSetAuthor}
        title=""
        setTitle={mockSetTitle}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByDisplayValue("Emily Dickinson")).toBeInTheDocument();
  });

  it("calls setAuthor when author input changes", async () => {
    const user = userEvent.setup();
    const mockSetAuthor = vi.fn();
    const mockSetTitle = vi.fn();
    const mockOnSearch = vi.fn();

    render(
      <SearchBar
        author=""
        setAuthor={mockSetAuthor}
        title=""
        setTitle={mockSetTitle}
        onSearch={mockOnSearch}
      />
    );

    const authorInput = screen.getByLabelText(/author/i);
    await user.type(authorInput, "Shakespeare");

    expect(mockSetAuthor).toHaveBeenCalled();
  });

  it("calls setTitle when title input changes", async () => {
    const user = userEvent.setup();
    const mockSetAuthor = vi.fn();
    const mockSetTitle = vi.fn();
    const mockOnSearch = vi.fn();

    render(
      <SearchBar
        author=""
        setAuthor={mockSetAuthor}
        title=""
        setTitle={mockSetTitle}
        onSearch={mockOnSearch}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    await user.type(titleInput, "Hamlet");

    expect(mockSetTitle).toHaveBeenCalled();
  });

  it("calls onSearch when search button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetAuthor = vi.fn();
    const mockSetTitle = vi.fn();
    const mockOnSearch = vi.fn();

    render(
      <SearchBar
        author="Emily Dickinson"
        setAuthor={mockSetAuthor}
        title="Hope"
        setTitle={mockSetTitle}
        onSearch={mockOnSearch}
      />
    );

    const searchButton = screen.getByRole("button", { name: /search/i });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it("renders randomize button", () => {
    const mockSetAuthor = vi.fn();
    const mockSetTitle = vi.fn();
    const mockOnSearch = vi.fn();
    const mockOnRandom = vi.fn();

    render(
      <SearchBar
        author=""
        setAuthor={mockSetAuthor}
        title=""
        setTitle={mockSetTitle}
        onSearch={mockOnSearch}
        onRandom={mockOnRandom}
      />
    );

    expect(
      screen.getByRole("button", { name: /find for a random poem/i })
    ).toBeInTheDocument();
  });

  it("calls onRandom and clears inputs when randomize button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetAuthor = vi.fn();
    const mockSetTitle = vi.fn();
    const mockOnSearch = vi.fn();
    const mockOnRandom = vi.fn();

    render(
      <SearchBar
        author="Emily Dickinson"
        setAuthor={mockSetAuthor}
        title="Hope"
        setTitle={mockSetTitle}
        onSearch={mockOnSearch}
        onRandom={mockOnRandom}
      />
    );

    const randomButton = screen.getByRole("button", {
      name: /find for a random poem/i,
    });
    await user.click(randomButton);

    expect(mockOnRandom).toHaveBeenCalledTimes(1);
    expect(mockSetAuthor).toHaveBeenCalledWith("");
    expect(mockSetTitle).toHaveBeenCalledWith("");
  });
});
