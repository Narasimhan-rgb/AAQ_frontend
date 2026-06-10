import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div>
        <h1>AAQ Algorithm</h1>
        <p>Adaptive Amplitude QuickSort Dashboard</p>
      </div>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/datasets">Datasets</NavLink>
        <NavLink to="/system">System Status</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;