import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

describe("Dashboard Page", () => {
  it("debería renderizar la página de dashboard", () => {
    render(<Dashboard />);
    expect(
      screen.getByRole("heading", { name: /Dashboard Page/i }),
    ).toBeInTheDocument();
  });
});
