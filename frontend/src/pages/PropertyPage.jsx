import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PropertyPage = ({ isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("Could not fetch property");

        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const deleteProperty = async (propertyId) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const res = await fetch(`/api/properties/${propertyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user?.token || ""}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete property");
    }
  };

  const onDeleteClick = async (propertyId) => {
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteProperty(propertyId);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="property-page">
      <button type="button" onClick={() => navigate("/")}>
        Back
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {product && (
        <div>
          <h2>{property.title}</h2>
          <p>Type: {property.propertyType}</p>
          <p>Description: {property.propetyDescription}</p>
          <p>Price: ${property.price}</p>
          <p>
            Address: {property.address.street}, {property.address.city}, {property.address.state}
          </p>
          <p>Square Feet: {property.address.SquareFeet}</p>
          <p>Year Built: {property.address.yearBuilt}</p>
          <p>Bedrooms: {property.address.Bedrooms}</p>

          {isAuthenticated && (
            <>
              <button type="button" onClick={() => navigate(`/edit-property/${property._id}`)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDeleteClick(property._id)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyPage;