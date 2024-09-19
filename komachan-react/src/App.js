import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PixivPage from './components/PixivPage';
import GithubPage from './components/GithubPage';
import FeaturePage from './components/FeaturePage';
import BackgroundSwitcher from './components/BackgroundSwitcher';
import GenerateImageForm from './components/generateComponets/GenerateImageForm';
import './App.css';

function App() {
  console.log('API URL:', process.env.REACT_APP_API_URL); 
  return (
    <Router>
      <div className="App">
        <BackgroundSwitcher />
        <Navbar />
        <header>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pixiv" element={<PixivPage />} />
            <Route path="/github" element={<GithubPage />} />
            <Route path="/features" element={<FeaturePage />} />
            <Route path="/generate" element={<GenerateImageForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
