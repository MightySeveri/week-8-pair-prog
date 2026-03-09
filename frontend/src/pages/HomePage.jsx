import { useEffect, useState } from "react";
import PropertyListings from "../components/PropertyListings";

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) throw new Error("Could not fetch properties");

        const data = await res.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsPending(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="home">
      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      <PropertyListings properties={properties} />
    </div>
  );
};

export default HomePage;