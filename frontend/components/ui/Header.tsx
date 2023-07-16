import React from 'react';
import './Header.scss';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, onLogin }) => {
  return <></>;
};

export default Header;
