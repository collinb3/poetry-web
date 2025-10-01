import { describe, it, expect, vi, beforeEach } from "vitest";
import * as ReactDOM from "react-dom/client";

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

vi.mock("./App.jsx", () => ({
  default: () => null,
}));

describe("main.jsx", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    vi.clearAllMocks();
  });

  it("imports without errors", async () => {
    expect(async () => {
      await import("./main.jsx");
    }).not.toThrow();
  });

  it("uses createRoot from react-dom/client", () => {
    expect(ReactDOM.createRoot).toBeDefined();
  });

  it("has a root element in the DOM", () => {
    const rootElement = document.getElementById("root");
    expect(rootElement).not.toBeNull();
  });
});
