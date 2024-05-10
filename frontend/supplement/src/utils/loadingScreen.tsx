import './../style/utils/loadingScreen.css';
import React, { useEffect } from 'react';
import plainLogo from './../images/loadingLogo.png'

const LoadingScreen: React.FC = () => {

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="loadingScreen">
      <img src={plainLogo} alt="logo" />
      <span className="loader"><span className="loader-inner"></span></span>
    </div>
  )
}

export default LoadingScreen;

