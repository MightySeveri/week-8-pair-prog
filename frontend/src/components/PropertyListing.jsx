import { Link } from "react-router-dom";

const PropertyListing = ({ property }) => {
  return (
    <article className="property-preview" aria-label={`Property ${property.title}`}>
      <h2>
        <Link to={`/properties/${property._id}`}>{property.title}</Link>
      </h2>
      <p>
        <strong>Category:</strong> {property.propertyType}
      </p>
      <p>
        <strong>Description:</strong> {property.description}
      </p>
      <p>
        <strong>Price:</strong> {property.price}
      </p>
    </article>
  );
};

export default PropertyListing;