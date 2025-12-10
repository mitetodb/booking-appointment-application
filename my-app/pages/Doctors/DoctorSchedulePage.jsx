import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { useTranslation } from '../../hooks/useTranslation';
import { Loading } from '../../components/common/Loading';
import { ErrorBox } from '../../components/common/ErrorBox';

export const DoctorSchedulePage = () => {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const days = [
    { id: 1, name: t.schedule?.monday || 'Monday' },
    { id: 2, name: t.schedule?.tuesday || 'Tuesday' },
    { id: 3, name: t.schedule?.wednesday || 'Wednesday' },
    { id: 4, name: t.schedule?.thursday || 'Thursday' },
    { id: 5, name: t.schedule?.friday || 'Friday' },
    { id: 6, name: t.schedule?.saturday || 'Saturday' },
    { id: 0, name: t.schedule?.sunday || 'Sunday' }
  ];

  const [newEntry, setNewEntry] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        setMsg('');
        
        // Try to get working hours from dedicated endpoint first
        let workingHours = null;
        try {
          const hoursData = await doctorService.getMyWorkingHours();
          console.log('Working hours response:', hoursData);
          
          // Handle different response structures
          if (Array.isArray(hoursData)) {
            workingHours = hoursData;
          } else if (hoursData && Array.isArray(hoursData.workingHours)) {
            workingHours = hoursData.workingHours;
          } else if (hoursData && Array.isArray(hoursData.data)) {
            workingHours = hoursData.data;
          }
        } catch (hoursErr) {
          // If dedicated endpoint doesn't exist or fails, try profile endpoint
          console.log('Working hours endpoint not available, trying profile:', hoursErr);
          const profile = await doctorService.getMyProfile();
          console.log('Profile response:', profile);
          
          if (profile) {
            if (Array.isArray(profile.workingHours)) {
              workingHours = profile.workingHours;
            } else if (profile.data && Array.isArray(profile.data.workingHours)) {
              workingHours = profile.data.workingHours;
            }
          }
        }
        
        if (workingHours && Array.isArray(workingHours) && workingHours.length > 0) {
          setSchedule(workingHours);
        } else {
          setSchedule([]);
        }
      } catch (err) {
        console.error('Error loading schedule:', err);
        console.error('Error response:', err.response);
        const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
        console.error('Error details:', errorMessage);
        
        if (err.response?.status !== 404) {
          setError(t.schedule?.loadError || 'Failed to load schedule. You can still add new working hours below.');
        }
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const handleAdd = () => {
    if (newEntry.startTime >= newEntry.endTime) {
      setError(t.schedule?.timeError || 'Start time must be before end time.');
      return;
    }
    
    // Check for duplicate day
    const hasDuplicate = schedule.some(s => s.dayOfWeek === newEntry.dayOfWeek);
    if (hasDuplicate) {
      setError(t.schedule?.duplicateDay || 'This day already exists in your schedule. Please remove it first or choose a different day.');
      return;
    }
    
    setSchedule((s) => [...s, { ...newEntry }]);
    setError('');
    setMsg('');
  };

  const handleRemove = async (index) => {
    const entryToRemove = schedule[index];
    const dayOfWeek = entryToRemove.dayOfWeek;
    
    // Optimistically update UI
    const updatedSchedule = schedule.filter((_, i) => i !== index);
    setSchedule(updatedSchedule);
    setError('');
    setMsg('');

    // Use DELETE endpoint for the specific day
    try {
      setSaving(true);
      await doctorService.deleteWorkingHoursByDay(dayOfWeek);
      setMsg(t.schedule?.removeSuccess || 'Working day removed successfully.');
    } catch (err) {
      console.error('Error removing working hours:', err);
      // Revert on error
      setSchedule(schedule);
      const errorMsg = err.response?.data?.message || err.message || t.schedule?.removeError || 'Failed to remove working day.';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (schedule.length === 0) {
      setError(t.schedule?.emptySchedule || 'Please add at least one working day before saving.');
      return;
    }

    // Validate all entries
    for (const entry of schedule) {
      if (entry.startTime >= entry.endTime) {
        setError(t.schedule?.timeError || 'Start time must be before end time for all entries.');
        return;
      }
    }

    try {
      setError('');
      setMsg('');
      setSaving(true);
      
      // Ensure data format is correct - convert to proper structure
      const scheduleToSend = schedule.map(entry => ({
        dayOfWeek: Number(entry.dayOfWeek),
        startTime: String(entry.startTime),
        endTime: String(entry.endTime)
      }));
      
      console.log('Saving schedule (formatted):', JSON.stringify(scheduleToSend, null, 2));
      console.log('Schedule array:', scheduleToSend);
      
      const updated = await doctorService.updateMyWorkingHours(scheduleToSend);
      
      console.log('Save response:', updated);
      
      if (updated && updated.workingHours) {
        setSchedule(updated.workingHours);
        setMsg(t.schedule?.saveSuccess || 'Working hours updated successfully.');
      } else if (updated) {
        // If response doesn't have workingHours but has data, assume success
        setMsg(t.schedule?.saveSuccess || 'Working hours updated successfully.');
      } else {
        // If no response data, still assume success (some APIs return 204 No Content)
        setMsg(t.schedule?.saveSuccess || 'Working hours updated successfully.');
      }
    } catch (err) {
      console.error('Error saving schedule:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error config:', err.config);
      
      // Extract detailed error message
      let errorMessage = t.schedule?.saveError || 'Failed to save schedule.';
      
      // Try to get the most specific error message
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(', ');
        } else if (typeof errorData === 'object') {
          // Try to extract any error message from the object
          const errorKeys = Object.keys(errorData);
          if (errorKeys.length > 0) {
            errorMessage = `${errorMessage} Details: ${JSON.stringify(errorData)}`;
          }
        }
      } else if (err.message && err.message !== 'Network Error') {
        errorMessage = `${errorMessage} (${err.message})`;
      } else if (err.message === 'Network Error') {
        errorMessage = t.schedule?.networkError || 'Network error. Please check your connection and try again.';
      }
      
      // For 500 errors, provide more helpful message
      if (err.response?.status === 500) {
        errorMessage = `${t.schedule?.serverError || 'Internal server error'}. ${errorMessage}`;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading && schedule.length === 0) return <Loading />;

  return (
    <section className="schedule-page">
      <div className="schedule-header">
        <h2>{t.schedule?.title || 'My Schedule'}</h2>
        <p className="schedule-subtitle">{t.schedule?.subtitle || 'Manage your working days and available hours'}</p>
      </div>

      {msg && (
        <div className="schedule-message success-message">
          <span className="message-icon">✓</span>
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div className="schedule-message error-message" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="message-icon">⚠</span>
          <span style={{ flex: 1 }}>{error}</span>
          <button 
            onClick={() => setError('')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0',
              lineHeight: '1',
              opacity: 0.7
            }}
            title="Dismiss"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="schedule-content">
        {/* Current Schedule Card */}
        <div className="schedule-card">
          <div className="schedule-card-header">
            <h3>{t.schedule?.currentHours || 'Current Working Hours'}</h3>
            <p className="card-subtitle">{t.schedule?.currentHoursDesc || 'Your current working schedule'}</p>
          </div>

          {schedule.length === 0 ? (
            <div className="empty-schedule">
              <span className="empty-icon">📅</span>
              <p>{t.schedule?.noHours || 'No working hours set. Add your first working day below.'}</p>
            </div>
          ) : (
            <div className="schedule-list">
              {schedule.map((s, index) => (
                <div key={index} className="schedule-item">
                  <div className="schedule-item-info">
                    <span className="schedule-day">{days.find((d) => d.id === s.dayOfWeek)?.name}</span>
                    <span className="schedule-time">
                      {s.startTime} - {s.endTime}
                    </span>
                  </div>
                  <button 
                    className="btn-danger small" 
                    onClick={() => handleRemove(index)}
                    title={t.schedule?.remove || 'Remove'}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Schedule Card */}
        <div className="schedule-card">
          <div className="schedule-card-header">
            <h3>{t.schedule?.addNew || 'Add New Working Day'}</h3>
            <p className="card-subtitle">{t.schedule?.addNewDesc || 'Add a new day to your working schedule'}</p>
          </div>

          <div className="working-form">
            <div className="form-group">
              <label>
                {t.schedule?.day || 'Day'}
                <select
                  value={newEntry.dayOfWeek}
                  onChange={(e) =>
                    setNewEntry((n) => ({ ...n, dayOfWeek: Number(e.target.value) }))
                  }
                  className="form-select"
                >
                  {days.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-group">
              <label>
                {t.schedule?.startTime || 'Start Time'}
                <input
                  type="time"
                  value={newEntry.startTime}
                  onChange={(e) =>
                    setNewEntry((n) => ({ ...n, startTime: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                {t.schedule?.endTime || 'End Time'}
                <input
                  type="time"
                  value={newEntry.endTime}
                  onChange={(e) =>
                    setNewEntry((n) => ({ ...n, endTime: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="form-actions">
              <button className="btn" onClick={handleAdd}>
                {t.schedule?.addDay || 'Add Day'}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {schedule.length > 0 && (
          <div className="schedule-actions">
            <button 
              className="btn-primary" 
              onClick={handleSave}
              disabled={saving}
              style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? (t.schedule?.saving || 'Saving...') : (t.schedule?.saveSchedule || 'Save Schedule')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};