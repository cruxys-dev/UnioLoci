import { describe, it, expect } from "vitest";
import { render } from "../../../test/testUtils";
import { BackgroundDecor } from "./BackgroundDecor";

describe("BackgroundDecor Component", () => {
  it("debería renderizar los elementos decorativos", () => {
    const { container } = render(<BackgroundDecor />);
    // Debería tener 4 divs (el contenedor principal y los 3 blobs)
    expect(container.querySelectorAll("div").length).toBe(4);
  });

  it("debería tener las clases de animación", () => {
    const { container } = render(<BackgroundDecor />);
    const blobs = container.querySelectorAll(".animate-blob");
    expect(blobs.length).toBe(3);
  });
});
