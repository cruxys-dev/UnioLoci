import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Privacy from "./Privacy";

describe("Privacy Policy Page", () => {
  it("debería renderizar la página de política de privacidad", () => {
    render(<Privacy />);
    expect(
      screen.getByRole("heading", { name: /Privacy Policy/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your privacy is important to us/i),
    ).toBeInTheDocument();
  });
});
