import React from 'react';
import { ErrorMessageManager } from '../utils/errorMessageManager.js';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const errorManager = ErrorMessageManager.getInstance();
  const [currentLanguage, setCurrentLanguage] = React.useState<'ja' | 'en'>('ja');

  const handleLanguageChange = (language: 'ja' | 'en') => {
    errorManager.setLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <div className="language-selector">
      <button
        className={`language-button ${currentLanguage === 'ja' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('ja')}
      >
        日本語
      </button>
      <button
        className={`language-button ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSelector; 