import { useState, useRef, useEffect } from 'react';
import { specialties, getSpecialtyById } from '../../constants/specialties';
import { useLanguage } from '../../contexts/LanguageContext';
import './SpecialtySelector.css';

export const SpecialtySelector = ({ value, onChange, placeholder, disabled = false }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const currentSpecialty = value ? getSpecialtyById(value, language) : null;
  const filteredSpecialties = specialties.filter(s => {
    const name = (s[language] || s.bg || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search);
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (specialtyId) => {
    if (value === specialtyId) {
      onChange(null);
    } else {
      onChange(specialtyId);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  return (
    <div className="specialty-selector" ref={dropdownRef}>
      <div
        className={`specialty-selector-input ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
      >
        <span className={currentSpecialty ? 'selected-value' : 'placeholder'}>
          {currentSpecialty || placeholder || 'Select specialty'}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="specialty-dropdown">
          <div className="specialty-search">
            <input
              type="text"
              placeholder="Search specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="specialty-list">
            {filteredSpecialties.length === 0 ? (
              <div className="specialty-no-results">No specialties found</div>
            ) : (
              filteredSpecialties.map((specialty) => {
                const name = specialty[language] || specialty.bg;
                return (
                  <div
                    key={specialty.id}
                    className={`specialty-option ${value === specialty.id ? 'selected' : ''}`}
                    onClick={() => handleSelect(specialty.id)}
                  >
                    <span className="specialty-name">{name}</span>
                    {value === specialty.id && <span className="check">✓</span>}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

