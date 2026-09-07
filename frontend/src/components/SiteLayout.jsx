import { Link, NavLink, Outlet } from "react-router";
import logo from "../assets/logo.png";
import "./SiteLayout.css";

const SiteLayout = () => {
  return (
    <div className="site-layout">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container site-header-inner">
          <Link to="/" className="site-brand" aria-label="IDX Exchange home">
            <img src={logo} alt="IDX Exchange" className="site-logo" />
          </Link>

          <nav aria-label="Main navigation">
            <NavLink to="/" end className="site-nav-link">
              Explore properties
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="mb-0">IDX Exchange — A place to call home.</p>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
