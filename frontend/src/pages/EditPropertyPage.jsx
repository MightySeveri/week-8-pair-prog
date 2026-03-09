import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propetyDescription, setPropertyDescription] = useState("");
  const [price, setPrice] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [SquareFeet, setSquareFeet] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [Bedrooms, setBedrooms] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("Could not fetch property details");

        const data = await res.json();
        setTitle(data.title || "");
        setPropertyType(data.propertyType || "");
        setPropertyDescription(data.propetyDescription || "");
        setPrice(data.price || "");
        setStreet(data.address?.street || "");
        setCity(data.address?.city || "");
        setState(data.address?.state || "");
        setSquareFeet(data.address?.SquareFeet || "");
        setYearBuilt(data.address?.yearBuilt || "");
        setBedrooms(data.address?.Bedrooms || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const submitForm = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const payload = {
      title,
      propertyType,
      propetyDescription,
      price: parseFloat(price),
      address: {
        street,
        city,
        state,
        SquareFeet: parseInt(SquareFeet, 10),
        yearBuilt: parseInt(yearBuilt, 10),
        Bedrooms: parseInt(Bedrooms, 10),
      },
    };

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update property");
      }

      navigate(`/properties/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create">
      <h2>Update Property</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && (
        <form onSubmit={submitForm}>
          <label>Title:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Property Type:</label>
          <input
            type="text"
            required
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          />
          <label>Description:</label>
          <input
            type="text"
            required
            value={propetyDescription}
            onChange={(e) => setPropertyDescription(e.target.value)}
          />
          <label>Price:</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label>Street:</label>
          <input
            type="text"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          <label>City:</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label>State:</label>
          <input
            type="text"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <label>Square Feet:</label>
          <input
            type="number"
            required
            value={SquareFeet}
            onChange={(e) => setSquareFeet(e.target.value)}
          />
          <label>Year Built:</label>
          <input
            type="number"
            required
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
          />
          <label>Bedrooms:</label>
          <input
            type="number"
            required
            value={Bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Property"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditPropertyPage;