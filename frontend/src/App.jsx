import ListingPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import "./App.css";
import SiteLayout from "./components/SiteLayout";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<ListingPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;
