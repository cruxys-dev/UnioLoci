import {
  render,
  type RenderOptions,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import React, { type ReactElement } from "react";
import { MemoryRouter } from "react-router";

// Custom render that includes common providers like Router
const AllTheProviders = ({
  children,
  initialEntries = ["/"],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { initialEntries?: string[] },
) => {
  const { initialEntries, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders {...props} initialEntries={initialEntries} />
    ),
    ...renderOptions,
  });
};

// Explicitly export testing library utilities to avoid lint issues with *
export { screen, fireEvent, waitFor };
export { customRender as render };
