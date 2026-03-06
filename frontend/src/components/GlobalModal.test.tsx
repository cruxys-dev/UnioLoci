import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../test/testUtils";
import userEvent from "@testing-library/user-event";
import { GlobalModal } from "./GlobalModal";
import { useUIStore } from "../store/ui.store";

// Factory for Modal Configuration
const getMockModalConfig = (overrides = {}) => ({
  title: "Test Title",
  message: "Test Message",
  type: "info" as const,
  onConfirm: vi.fn(),
  ...overrides,
});

describe("GlobalModal Component", () => {
  beforeEach(() => {
    useUIStore.setState({ modal: null });
  });

  it("no debería renderizar nada si no hay modal en el store", () => {
    const { container } = render(<GlobalModal />);
    expect(container.firstChild).toBeNull();
  });

  it("debería renderizar el título y mensaje correctamente", () => {
    const config = getMockModalConfig();
    useUIStore.setState({ modal: config });

    render(<GlobalModal />);

    expect(screen.getByText(config.title)).toBeInTheDocument();
    expect(screen.getByText(config.message)).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("debería llamar a hideModal y onConfirm al hacer clic en el botón", async () => {
    const user = userEvent.setup();
    const config = getMockModalConfig();
    useUIStore.setState({ modal: config });

    render(<GlobalModal />);

    const button = screen.getByText("Entendido");
    await user.click(button);

    expect(config.onConfirm).toHaveBeenCalled();
    expect(useUIStore.getState().modal).toBeNull();
  });
});
