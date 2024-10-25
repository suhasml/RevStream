import { Link, useNavigate, useLocation } from 'react-router-dom';
import DropdownButton from 'components/ux/dropdown-button/DropdownButton';
import { networkAdapter } from 'services/NetworkAdapter';
import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';

/**
 * A component that renders the navigation items for the navbar for both mobile/desktop view.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.isAuthenticated - A flag indicating whether the user is authenticated.
 * @param {Function} props.onHamburgerMenuToggle
 */
const UserLoginItems = ({ isAuthenticated, onHamburgerMenuToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const context = useContext(AuthContext);

    /**
     * Handles the logout action by calling the logout API and updating the authentication state.
     */
    const handleLogout = async () => {
        await networkAdapter.post('api/users/logout');
        context.triggerAuthCheck();
        navigate('/login');
    };

    const dropdownOptions = [
        { name: 'Profile', onClick: () => navigate('/user-profile') },
        { name: 'Logout', onClick: handleLogout },
    ];

    /**
     * Determines if a given path is the current active path.
     *
     * @param {string} path - The path to check.
     * @returns {boolean} - True if the path is active, false otherwise.
     */
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <li className="p-4 hover:bg-black-900 md:hover:bg-black">
                <Link
                    to="/"
                    className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/') && 'active-link'
                        }`}
                    onClick={onHamburgerMenuToggle}
                >
                    Home
                </Link>
            </li>
            <li className="p-4 hover:bg-black-900 md:hover:bg-black">
                <Link
                    to="/offers"
                    className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/offers') && 'active-link'
                        }`}
                    onClick={onHamburgerMenuToggle}
                >
                    Offers
                </Link>
            </li>
            <li className="p-4 hover:bg-black-900 md:hover:bg-black">
                <Link
                    to="/events"
                    className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/events') && 'active-link'
                        }`}
                    onClick={onHamburgerMenuToggle}
                >
                    Events
                </Link>
            </li>
            <li className="p-4 hover:bg-black-900 md:hover:bg-black">
                <Link
                    to="/benefits"
                    className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/benefits') && 'active-link'
                        }`}
                    onClick={onHamburgerMenuToggle}
                >
                    benefits
                </Link>
            </li>
            <li
                className={`${!isAuthenticated && 'p-4 hover:bg-black-900 md:hover:bg-black'}`}
            >
                {isAuthenticated ? (
                    <DropdownButton triggerType="click" options={dropdownOptions} />
                ) : (
                    <Link
                        to="/store"
                        className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/store') && 'active-link'
                            }`}
                        onClick={onHamburgerMenuToggle}
                    >
                        Store
                    </Link>
                )}
            </li>
            <li
                className={`${!isAuthenticated && 'p-4 hover:bg-black-900 md:hover:bg-black'}`}
            >
                {isAuthenticated ? (
                    <DropdownButton triggerType="click" options={dropdownOptions} />
                ) : (
                    <Link
                        to="/merchandise"
                        className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/merchandise') && 'active-link'
                            }`}
                        onClick={onHamburgerMenuToggle}
                    >
                        Merchandise
                    </Link>
                )}
            </li>
            <li
                className={`${!isAuthenticated && 'p-4 hover:bg-black-900 md:hover:bg-black'}`}
            >
                {isAuthenticated ? (
                    <DropdownButton triggerType="click" options={dropdownOptions} />
                ) : (
                    <Link
                        to="/join-community"
                        className={`uppercase font-medium text-slate-100 hover-underline-animation ${isActive('/join-community') && 'active-link'
                            }`}
                        onClick={onHamburgerMenuToggle}
                    >
                        Join community
                    </Link>
                )}
            </li>
        </>
    );
};

export default UserLoginItems;
