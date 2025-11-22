import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { RefPage } from "./pages/RefPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RefPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
