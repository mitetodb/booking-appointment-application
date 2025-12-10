import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import './LanguageSwitcher.css';

export const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'bg', flag: '🇧🇬', name: 'Български', fallback: 'BG' },
    { code: 'en', flag: '🇬🇧', name: 'English', fallback: 'EN' },
    { code: 'de', flag: '🇩🇪', name: 'Deutsch', fallback: 'DE' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="lang-dropdown-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span className="flag" role="img" aria-label={
          currentLanguage.code === 'bg' ? 'Bulgarian flag' : 
          currentLanguage.code === 'en' ? 'British flag' : 
          'German flag'
        }>
          {currentLanguage.flag}
        </span>
        <span className="lang-code">{currentLanguage.code.toUpperCase()}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`lang-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="flag" role="img" aria-label={
                lang.code === 'bg' ? 'Bulgarian flag' : 
                lang.code === 'en' ? 'British flag' : 
                'German flag'
              }>
                {lang.flag}
              </span>
              <span className="lang-name">{lang.name}</span>
              {language === lang.code && <span className="check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

