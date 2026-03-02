import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Header } from "./components/Header";
import { AuthContextProvider } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <div className="root-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
