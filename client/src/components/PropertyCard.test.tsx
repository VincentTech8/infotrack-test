import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PropertyCard } from "./PropertyCard";

describe("PropertyCard", () => {
  const baseProps = {
    fullAddress: "10 Example St, Carlton VIC 3053",
    lotPlan: { lot: "12", plan: "PS123456" },
    volumeFolio: { volume: "123", folio: "456" },
  };

  it("opens and closes the modal", () => {
    render(<PropertyCard {...baseProps} />);
    const editButton = screen.getAllByText(/edit volume\/folio/i)[0];

    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeTruthy();

    fireEvent.click(screen.getByText(/close/i));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows validation errors on invalid input", async () => {
    render(<PropertyCard {...baseProps} />);
    const editButton = screen.getAllByText(/edit volume\/folio/i)[0];
    fireEvent.click(editButton);

    fireEvent.change(screen.getByLabelText(/volume:/i), {
      target: { value: "abcdef" },
    });
    fireEvent.change(screen.getByLabelText(/folio:/i), {
      target: { value: "1234567" },
    });

    fireEvent.click(screen.getByText(/confirm/i));

    await waitFor(() => {
      expect(screen.getByText(/1–6 digits required/i)).toBeTruthy();
      expect(screen.getByText(/1–5 digits required/i)).toBeTruthy();
    });
  });

  it("successfully updates volume and folio on confirm", async () => {
    render(<PropertyCard {...baseProps} />);
    const editButton = screen.getAllByText(/edit volume\/folio/i)[0];
    fireEvent.click(editButton);

    fireEvent.change(screen.getByLabelText(/volume:/i), {
      target: { value: "999" },
    });
    fireEvent.change(screen.getByLabelText(/folio:/i), {
      target: { value: "1112" },
    });

    fireEvent.click(screen.getByText(/confirm/i));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();

      const card = screen
        .getAllByText(/address:/i)[0]
        .closest(".property-card") as HTMLElement; // assert as HTMLElement
      expect(card).toBeTruthy();

      const { getByText } = within(card);

      // assert parentElement is an HTMLElement
      const volumeText = getByText(/volume:/i).parentElement as HTMLElement;
      const folioText = getByText(/folio:/i).parentElement as HTMLElement;

      expect(volumeText.textContent).toMatch(/999/);
      expect(folioText.textContent).toMatch(/111/);
    });
  });
});
