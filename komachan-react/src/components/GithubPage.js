// src/components/GithubPage.js
import React from 'react';
import './GithubPage.css';

function GithubPage() {
  return (
    <div className="github-page">
      <h2>My GitHub Projects</h2>
      <a href="https://github.com/Komari-chan" target="_blank" rel="noopener noreferrer">
        Visit my GitHub Profile
      </a>
      <div className="projects">
        {/* 这里可以展示你的项目，可能需要动态加载 */}
      </div>
    </div>
  );
}

export default GithubPage;
