import React from 'react';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faXTwitter, faPixiv } from '@fortawesome/free-brands-svg-icons'; // 确保导入正确的图标
import avatar from '../assets/avatar.jpg'; // 确保路径正确

function HomePage() {
  return (
    <div className="home-page">
      <div className="avatar-container">
        <img src={avatar} alt="Avatar" className="avatar" />
      </div>
      <h1 className="site-title">Komachan</h1>
      <div className="social-links">
        <a href="https://twitter.com/KomachanAI" target="_blank" rel="noopener noreferrer" className="x-icon">
          <FontAwesomeIcon icon={faXTwitter} size="3x" />
        </a>
        <a href="https://github.com/Komari-chan" target="_blank" rel="noopener noreferrer" className="github-icon">
          <FontAwesomeIcon icon={faGithub} size="3x" />
        </a>
        <a href="https://www.pixiv.net/users/31874437" target="_blank" rel="noopener noreferrer" className="pixiv-icon">
          <FontAwesomeIcon icon={faPixiv} size="3x" />
        </a>
      </div>
    </div>
  );
}

export default HomePage;
