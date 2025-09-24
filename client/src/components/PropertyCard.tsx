import { useState, useEffect, useRef } from "react";
import "./PropertyCard.css";

export type InternalProperty = {
  fullAddress: string;
  lotPlan?: { lot?: string; plan?: string };
  volumeFolio: { volume: string | null; folio: string | null };
  status: "KnownVolFol" | "UnknownVolFol";
  sourceTrace: { provider?: string; requestId?: string; receivedAt?: string };
};

type Props = Pick<InternalProperty, "fullAddress" | "volumeFolio" | "lotPlan">;

export const PropertyCard: React.FC<Props> = ({ fullAddress, lotPlan, volumeFolio }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const [displayVolume, setDisplayVolume] = useState(volumeFolio.volume || "");
  const [displayFolio, setDisplayFolio] = useState(volumeFolio.folio || "");

  const [tempVolume, setTempVolume] = useState(displayVolume);
  const [tempFolio, setTempFolio] = useState(displayFolio);
  const [errors, setErrors] = useState({ volume: "", folio: "" });

  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap & Escape
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>("input, button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const validate = () => {
    const volErr = /^\d{1,6}$/.test(tempVolume) ? "" : "1–6 digits required";
    const folErr = /^\d{1,5}$/.test(tempFolio) ? "" : "1–5 digits required";
    setErrors({ volume: volErr, folio: folErr });
    return !volErr && !folErr;
  };

  const confirm = () => {
    if (validate()) {
      setDisplayVolume(tempVolume);
      setDisplayFolio(tempFolio);
      setModalOpen(false);
    }
  };

  const close = () => {
    setTempVolume(displayVolume);
    setTempFolio(displayFolio);
    setErrors({ volume: "", folio: "" });
    setModalOpen(false);
  };

  return (
    <div className="property-card">
      <p><strong>Address:</strong> {fullAddress}</p>
      {lotPlan && <p><strong>Lot/Plan:</strong> Lot {lotPlan.lot}, Plan {lotPlan.plan}</p>}
      <p><strong>Volume:</strong> {displayVolume || "Unknown"}</p>
      <p><strong>Folio:</strong> {displayFolio || "Unknown"}</p>

      <button className="edit-button" onClick={() => setModalOpen(true)}>
        Edit Volume/Folio
      </button>

      {modalOpen && (
        <div ref={modalRef} role="dialog" aria-modal="true" className="modal-overlay">
          <div className="modal-content">
            <label>
              Volume:
              <input
                type="text"
                value={tempVolume}
                onChange={(e) => setTempVolume(e.target.value)}
                autoFocus
                className={errors.volume ? "error" : ""}
              />
              {errors.volume && <div className="error-text">{errors.volume}</div>}
            </label>

            <label>
              Folio:
              <input
                type="text"
                value={tempFolio}
                onChange={(e) => setTempFolio(e.target.value)}
                className={errors.folio ? "error" : ""}
              />
              {errors.folio && <div className="error-text">{errors.folio}</div>}
            </label>

            <div className="modal-actions">
              <button className="confirm-button" onClick={confirm}>Confirm</button>
              <button className="close-button" onClick={close}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
