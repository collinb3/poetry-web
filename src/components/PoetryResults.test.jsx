import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PoetryResults from "./PoetryResults";

const mockPoetData = [
  {
    title: "Poem 1",
    author: "Emily Dickinson",
    lines: ["Line 1", "Line 2"],
    linecount: 2,
  },
  {
    title: "Poem 2",
    author: "Emily Dickinson",
    lines: ["Line A", "Line B"],
    linecount: 2,
  },
  {
    title: "Poem 3",
    author: "Emily Dickinson",
    lines: ["Line X", "Line Y"],
    linecount: 2,
  },
  {
    title: "Poem 4",
    author: "Emily Dickinson",
    lines: ["Line M", "Line N"],
    linecount: 2,
  },
  {
    title: "Poem 5",
    author: "Emily Dickinson",
    lines: ["Line P", "Line Q"],
    linecount: 2,
  },
  {
    title: "Poem 6",
    author: "Emily Dickinson",
    lines: ["Line R", "Line S"],
    linecount: 2,
  },
];

describe("PoetryResults", () => {
  it("renders poems for the current page", () => {
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={1}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    expect(screen.getByText("Poem 1")).toBeInTheDocument();
    expect(screen.getByText("Poem 5")).toBeInTheDocument();
    expect(screen.queryByText("Poem 6")).not.toBeInTheDocument();
  });

  it("displays the author name", () => {
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={1}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    expect(screen.getByText(/Poems by Emily Dickinson/i)).toBeInTheDocument();
  });

  it("displays pagination controls", () => {
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={1}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("disables Previous button on first page", () => {
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={1}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    const prevButton = screen.getByRole("button", { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it("disables Next button on last page", () => {
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={2}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it("calls setPageNumber when Next button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={1}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    await user.click(nextButton);

    expect(mockSetPageNumber).toHaveBeenCalledWith(2);
  });

  it("calls setPageNumber when Previous button is clicked", async () => {
    const user = userEvent.setup();
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={2}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    const prevButton = screen.getByRole("button", { name: /previous/i });
    await user.click(prevButton);

    expect(mockSetPageNumber).toHaveBeenCalledWith(1);
  });

  it("calls setPoemToShow and setShowPoemDetails when More Details is clicked", async () => {
    const user = userEvent.setup();
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={mockPoetData}
        pageNumber={1}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    const moreDetailsButtons = screen.getAllByRole("button", {
      name: /more details/i,
    });
    await user.click(moreDetailsButtons[0]);

    expect(mockSetPoemToShow).toHaveBeenCalledWith(mockPoetData[0]);
    expect(mockSetShowPoemDetails).toHaveBeenCalledWith(true);
  });

  it('renders "No poems found" when poetData is null', () => {
    const mockSetPageNumber = vi.fn();
    const mockSetPoemToShow = vi.fn();
    const mockSetShowPoemDetails = vi.fn();

    render(
      <PoetryResults
        poetData={null}
        pageNumber={1}
        setPageNumber={mockSetPageNumber}
        setPoemToShow={mockSetPoemToShow}
        setShowPoemDetails={mockSetShowPoemDetails}
      />
    );

    expect(screen.getByText(/No poems found/i)).toBeInTheDocument();
  });
});
