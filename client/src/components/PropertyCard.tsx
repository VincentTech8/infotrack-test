import { useState, useEffect, useRef } from "react";

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

  const buttonBaseStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s",
    fontWeight: 500,
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "1.5rem",
        maxWidth: "420px",
        margin: "2rem auto",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        color: "#000",
      }}
    >
      <p style={{ marginBottom: "0.5rem" }}><strong>Address:</strong> {fullAddress}</p>
      {lotPlan && (
        <p style={{ marginBottom: "0.5rem" }}>
          <strong>Lot/Plan:</strong> Lot {lotPlan.lot}, Plan {lotPlan.plan}
        </p>
      )}
      <p style={{ marginBottom: "0.5rem" }}><strong>Volume:</strong> {displayVolume || "Unknown"}</p>
      <p style={{ marginBottom: "1rem" }}><strong>Folio:</strong> {displayFolio || "Unknown"}</p>

      <button
        onClick={() => setModalOpen(true)}
        style={{ ...buttonBaseStyle, border: "none", backgroundColor: "#007bff", color: "#fff" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
      >
        Edit Volume/Folio
      </button>

      {modalOpen && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              color: "#000",
              padding: "2rem",
              borderRadius: "12px",
              minWidth: "340px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <label style={{ fontWeight: 500 }}>
              Volume:
              <input
                type="text"
                value={tempVolume}
                onChange={(e) => setTempVolume(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                  borderRadius: "6px",
                  border: errors.volume ? "1px solid red" : "1px solid #ccc",
                  color: "#000",
                  backgroundColor: "#fff",
                  fontSize: "1rem",
                }}
              />
              {errors.volume && <div style={{ color: "red", marginTop: "0.25rem" }}>{errors.volume}</div>}
            </label>

            <label style={{ fontWeight: 500 }}>
              Folio:
              <input
                type="text"
                value={tempFolio}
                onChange={(e) => setTempFolio(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                  borderRadius: "6px",
                  border: errors.folio ? "1px solid red" : "1px solid #ccc",
                  color: "#000",
                  backgroundColor: "#fff",
                  fontSize: "1rem",
                }}
              />
              {errors.folio && <div style={{ color: "red", marginTop: "0.25rem" }}>{errors.folio}</div>}
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                onClick={confirm}
                style={{ ...buttonBaseStyle, border: "none", backgroundColor: "#28a745", color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
              >
                Confirm
              </button>
              <button
                onClick={close}
                style={{ ...buttonBaseStyle, border: "1px solid #ccc", backgroundColor: "#f8f9fa", color: "#000" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e2e6ea")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
