import ListingPage from "./components/ListingsPage";
import PropertyFilters from "./components/PropertyFilters";
import logo from "./assets/logo.png";
import "./App.css";

function App() {
  return (
    <>
      <h1>
        <img src={logo} alt="IDX Exchange" id="logo" />
      </h1>
      <h2 className="px-3">Property Search</h2>
      <ListingPage />
    </>
  );
}

export default App;
