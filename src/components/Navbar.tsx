import "@/styles/Navbar.scss";
import Link from "next/link";
const Navbar = () => {
  return (
    <>
      <nav className="nav">
        <input type="checkbox" className="nav__cb" id="menu-cb" />
        <div className="nav__content">
          <ul className="nav__items">
            <li className="nav__item">
              <span className="nav__item-text">
                <Link
                  href="/Login"
                >
                  Log Out
                </Link>
              </span>
            </li>
            <li className="nav__item">
              <span className="nav__item-text">
                <Link
                  href="/Plans"
                >
                  Plans
                </Link>
              </span>
            </li>
            <li className="nav__item">
              <span className="nav__item-text">
                <Link
                  href="/Settings"
                >
                  Settings Page
                </Link>
              </span>
            </li>
          </ul>
        </div>
        <label className="nav__btn" htmlFor="menu-cb"></label>
      </nav>
    </>
  );
};

export default Navbar;
