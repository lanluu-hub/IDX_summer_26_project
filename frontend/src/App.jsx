import ListingPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import "./App.css";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListingPage />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />
    </Routes>
  );
}

export default App;
