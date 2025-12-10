import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './UserSelector.css';

export const UserSelector = ({ value, onChange, placeholder, disabled = false, users = [] }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  
  const selectedUser = value ? users.find(u => u.id === value) : null;
  const displayName = selectedUser 
    ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() 
    : null;

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
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

  const handleSelect = (userId) => {
    if (value === userId) {
      onChange(null);
    } else {
      onChange(userId);
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
    <div className="user-selector" ref={dropdownRef}>
      <div
        className={`user-selector-input ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
      >
        <span className={displayName ? 'selected-value' : 'placeholder'}>
          {displayName || placeholder || 'Select patient'}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="user-dropdown">
          <div className="user-search">
            <input
              type="text"
              placeholder="Search patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="user-list">
            {filteredUsers.length === 0 ? (
              <div className="user-no-results">No patients found</div>
            ) : (
              filteredUsers.map((user) => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                return (
                  <div
                    key={user.id}
                    className={`user-option ${value === user.id ? 'selected' : ''}`}
                    onClick={() => handleSelect(user.id)}
                  >
                    <div className="user-info">
                      <span className="user-name">{fullName || 'Unnamed'}</span>
                      {user.email && (
                        <span className="user-email">{user.email}</span>
                      )}
                    </div>
                    {value === user.id && <span className="check">✓</span>}
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

