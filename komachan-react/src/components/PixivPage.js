// src/components/PixivPage.js
import React from 'react';
import './PixivPage.css';

function PixivPage() {
  return (
    <div className="pixiv-page">
      <h2>My Pixiv Profile</h2>
      <a href="https://www.pixiv.net/users/31874437" target="_blank" rel="noopener noreferrer">
        Visit my Pixiv Profile
      </a>
      <div className="gallery">
        {/* 这里可以展示你的作品集，可能需要动态加载 */}
      </div>
    </div>
  );
}

export default PixivPage;
