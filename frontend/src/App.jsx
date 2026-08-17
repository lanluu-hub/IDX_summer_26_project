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

  // return (
  //   <>
  //     <h1>
  //       <img src={logo} alt="IDX Exchange" id="logo" />
  //     </h1>
  //     <h2 className="px-3">Property Search</h2>
  //     <ListingPage />
  //   </>
  // );
}

export default App;
