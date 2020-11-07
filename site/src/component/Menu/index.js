import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { Logo, MiniLogo } from './Logo';
import './index.less'

function Menu({ data, showNav, handleOpenMenu, handleCloseMenu}) {
    //是否在首页的顶部 || 非首页
    const [onPageTop, setOnPageTop] = useState(true);
    const [isHover, setIsHover] = useState(false);
    const { pathname } = useLocation();
    const location = pathname.slice(1) || 'menu';

    const handleMouseEnter = () => {
        setIsHover(true);
    }

    const handleMouseLeave = () => {
        setIsHover(false);
    }

    const handleClickMenu = () => {
        if (document.documentElement.clientWidth <= 992) {
            handleCloseMenu();
        }
    }

    return (
        <header className="header">
            {   
                ((!onPageTop || location !== 'menu') && !showNav) ?
                <MiniLogo active={showNav || isHover} />:
                <Logo active={showNav} />
            }
            <div
                className={showNav ? "menu-toggle active" : "menu-toggle"}
                onClick={showNav ? handleCloseMenu: handleOpenMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className={!onPageTop || showNav || location !== 'menu' ? "menu-loca active" : "menu-loca"}>{location}</div>
                <MenuOutlined 
                    className={showNav ? "menu-icon hide": "menu-icon"}/>
                <CloseOutlined 
                    className={showNav ? "menu-icon" : "menu-icon hide"}/>
            </div>
            <nav className={showNav ? "menu-nav" : "menu-nav hide"}>
                <ul>
                    {data.map((item)=>
                        <li className="nav-item" key={item.path} onClick={handleClickMenu}>
                            <NavLink to={item.path}>{item.name}</NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    )
}

Menu.propTypes = {
    data: PropTypes.array.isRequired, 
    showNav: PropTypes.bool.isRequired, 
    handleOpenMenu: PropTypes.func.isRequired, 
    handleCloseMenu: PropTypes.func.isRequired
}

export default Menu;