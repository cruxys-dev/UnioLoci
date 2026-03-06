import { describe, it, expect } from "vitest";
import { render, screen } from "../../../test/testUtils";
import { Footer } from "./Footer";

describe("Footer Component", () => {
  it("debería renderizar el logo UnioLoci", () => {
    render(<Footer />);
    expect(screen.getByText("UnioLoci")).toBeInTheDocument();
  });

  it("debería contener enlaces legales", () => {
    render(<Footer />);
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  it("debería mostrar el copyright con el año actual", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument();
  });
});
