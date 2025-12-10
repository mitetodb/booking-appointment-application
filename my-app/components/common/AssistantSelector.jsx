import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './AssistantSelector.css';

export const AssistantSelector = ({ value, onChange, placeholder, disabled = false, assistants = [] }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  const selectedAssistant = value ? assistants.find(a => a.id === value) : null;
  const displayName = selectedAssistant 
    ? `${selectedAssistant.firstName || ''} ${selectedAssistant.lastName || ''}`.trim() 
    : null;

  const filteredAssistants = assistants.filter(a => {
    const fullName = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
    const email = (a.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
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

  const handleSelect = (assistantId) => {
    if (value === assistantId) {
      onChange(null);
    } else {
      onChange(assistantId);
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
    <div className="assistant-selector" ref={dropdownRef}>
      <div
        className={`assistant-selector-input ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
      >
        <span className={displayName ? 'selected-value' : 'placeholder'}>
          {displayName || placeholder || 'Select assistant'}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="assistant-dropdown">
          <div className="assistant-search">
            <input
              type="text"
              placeholder="Search assistant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="assistant-list">
            {filteredAssistants.length === 0 ? (
              <div className="assistant-no-results">No assistants found</div>
            ) : (
              filteredAssistants.map((assistant) => {
                const fullName = `${assistant.firstName || ''} ${assistant.lastName || ''}`.trim();
                return (
                  <div
                    key={assistant.id}
                    className={`assistant-option ${value === assistant.id ? 'selected' : ''}`}
                    onClick={() => handleSelect(assistant.id)}
                  >
                    <div className="assistant-info">
                      <span className="assistant-name">{fullName || 'Unnamed'}</span>
                      {assistant.email && (
                        <span className="assistant-email">{assistant.email}</span>
                      )}
                    </div>
                    {value === assistant.id && <span className="check">✓</span>}
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

