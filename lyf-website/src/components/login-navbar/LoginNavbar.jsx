// create a login navbar with the following lists add a navbar that contains these: offers, events, benefits, Store, Merchandise, Join community
import logo from 'assets/logos/lyf_White.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenuLogin from 'components/hamburger-menu/HamburgerMenuLogin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from 'contexts/AuthContext';
import { useContext } from 'react';
import UserLoginItems from 'components/navbar-items/UserLoginItems';

const LoginNavbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);
    const onHamburgerMenuToggle = () => {
        setIsVisible(!isVisible);
    };
    return (
        <div className="relative flex flex-wrap justify-between items-center px-4 md:px-12 global-navbar__container bg-black brand-divider-bottom shadow-md">
            <div className="flex">
                <Link to="/">
                    <img src={logo} alt="site logo" className="site-logo__img" />
                </Link>
            </div>
            <ul className="list-none hidden md:flex">
                <UserLoginItems isAuthenticated={isAuthenticated} />
            </ul>
            <FontAwesomeIcon
                data-testid="menu-toggle__button"
                icon={faBars}
                size="2x"
                color="#fff"
                className="block md:hidden"
                onClick={onHamburgerMenuToggle}
            />
            <HamburgerMenuLogin
                isVisible={isVisible}
                onHamburgerMenuToggle={onHamburgerMenuToggle}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
};

export default LoginNavbar;
// create a login navbar with the following lists add a navbar that contains these: offers, events, benefits, Store, Merchandise, Join community