import "./Navbar.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { getAuth } from "firebase/auth";

function Navbar() {

    const auth = getAuth();
    const user = auth.currentUser;

    return (

        <div className="navbar">

            <div className="navbar-title">

                <h2>Dashboard</h2>

            </div>

            <div className="navbar-search">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Search..."
                />

            </div>

            <div className="navbar-right">

                <FaBell className="bell"/>

                <div className="user-info">

                    <FaUserCircle className="user-icon"/>

                    <span>

                        {user ? user.email : "Farmer"}

                    </span>

                </div>

            </div>

        </div>

    );

}

export default Navbar;