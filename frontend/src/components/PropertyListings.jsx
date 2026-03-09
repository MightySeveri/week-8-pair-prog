import PropertyListing from "./PropertyListing";

const PropertyListings = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return <p className="no-properties">No properties available.</p>;
  }

  return (
    <div className="property-list">
      {properties.map((property) => (
        <PropertyListing key={property._id} property={property} />
      ))}
    </div>
  );
};

export default PropertyListings;