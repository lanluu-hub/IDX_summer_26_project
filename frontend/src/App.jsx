import ListingPage from "./components/ListingsPage";
import PropertyFilters from "./components/PropertyFilters";

function App() {
  return (
    <>
      <h1>IDX Property Search</h1>
      <PropertyFilters />
      <ListingPage />
    </>
  );
}

export default App;
