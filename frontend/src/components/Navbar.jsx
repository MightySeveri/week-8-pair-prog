import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Property</h1>
      </Link>
      <div className="links">
        {isAuthenticated && (
          <>
            <Link to="/properties/add-property">Add Property</Link>
            <span>{user?.email}</span>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;