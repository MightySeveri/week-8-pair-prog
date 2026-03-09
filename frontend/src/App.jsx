import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddPropertyPage from "./pages/AddPropertyPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PropertyPage from "./pages/PropertyPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return Boolean(user?.token);
    } catch {
      return false;
    }
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/properties/add-property"
              element={isAuthenticated ? <AddPropertyPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/edit-property/:id"
              element={isAuthenticated ? <EditPropertyPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/properties/:id"
              element={<PropertyPage isAuthenticated={isAuthenticated} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
                      <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;