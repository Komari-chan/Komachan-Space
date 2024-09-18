import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './BackgroundSwitcher.css';

const apiUrl = process.env.REACT_APP_API_URL;

const backgrounds = [
  `${apiUrl}/static/assets/background1.jpg`,
  `${apiUrl}/static/assets/background2.jpg`,
  `${apiUrl}/static/assets/background3.jpg`
];

function BackgroundSwitcher() {
  const [currentBackground, setCurrentBackground] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prevBackground) => (prevBackground + 1) % backgrounds.length);
    }, 5000); // 每5秒切换一次背景
    return () => clearInterval(interval);
  }, []);

  return (
    <TransitionGroup>
      <CSSTransition
        key={currentBackground}
        timeout={1000}
        classNames="fade"
      >
        <div
          className="background"
          style={{ backgroundImage: `url(${backgrounds[currentBackground]})` }}
        />
      </CSSTransition>
    </TransitionGroup>
  );
}

export default BackgroundSwitcher;
