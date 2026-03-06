import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Terms from "./Terms";

describe("Terms and Conditions Page", () => {
  it("debería renderizar la página de términos", () => {
    render(<Terms />);
    expect(
      screen.getByRole("heading", { name: /Terms and Conditions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Welcome to UnioLoci/i)).toBeInTheDocument();
  });
});
