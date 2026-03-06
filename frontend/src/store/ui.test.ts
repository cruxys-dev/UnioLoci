import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "./ui.store";

describe("UIStore", () => {
  beforeEach(() => {
    // Resetear el store antes de cada prueba
    useUIStore.setState({ modal: null });
  });

  it("debería inicializarse con modal nulo", () => {
    expect(useUIStore.getState().modal).toBeNull();
  });

  it("debería mostrar un modal con la configuración correcta", () => {
    const config = {
      title: "Test Modal",
      message: "This is a test message",
      type: "info" as const,
    };
    useUIStore.getState().showModal(config);
    expect(useUIStore.getState().modal).toEqual(config);
  });

  it("debería ocultar el modal", () => {
    useUIStore.setState({
      modal: { title: "Test", message: "Message" },
    });
    useUIStore.getState().hideModal();
    expect(useUIStore.getState().modal).toBeNull();
  });
});
