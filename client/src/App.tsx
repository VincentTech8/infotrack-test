import { useEffect, useState } from "react";
import "./App.css";
import { PropertyCard } from "./components/PropertyCard";
import type { InternalProperty } from "./components/PropertyCard";

function App() {
  const [property, setProperty] = useState<InternalProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      const externalProperty = {
        provider: "VIC-DDPA",
        requestId: "REQ-12345",
        receivedAt: "2025-09-24T02:28:23.659Z",
        addressParts: {
          street: "10 Example St",
          suburb: "Carlton",
          state: "VIC",
          postcode: "3053",
        },
        formattedAddress: "10 Example St, Carlton VIC 3053",
        lotPlan: { lot: "12", plan: "PS123456" },
        title: { volume: "", folio: "" },
      };

      try {
        const res = await fetch("http://localhost:5076/api/property/normalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(externalProperty),
        });

        if (!res.ok) throw new Error(`Failed to fetch property: ${res.status}`);
        const data: InternalProperty = await res.json();
        setProperty(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, []);

  return (
    <div className="App">
      <h1>Property Normalization Demo</h1>
      {loading && <p>Loading...</p>}
      {!loading && property && (
        <PropertyCard
          fullAddress={property.fullAddress}
          lotPlan={property.lotPlan}
          volumeFolio={property.volumeFolio}
        />
      )}
      {!loading && !property && <p>Failed to load property.</p>}
    </div>
  );
}

export default App;
