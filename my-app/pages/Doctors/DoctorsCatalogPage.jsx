import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { DoctorCard } from '../../components/doctors/DoctorCard';
import { ErrorBox } from '../../components/common/ErrorBox';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguage } from '../../contexts/LanguageContext';
import { specialties, getSpecialtyById } from '../../constants/specialties';
import { SpecialtySelector } from '../../components/common/SpecialtySelector';

export const DoctorsCatalogPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [onlyInsurance, setOnlyInsurance] = useState(false);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await doctorService.getAll();
        const doctorsList = Array.isArray(data) ? data : (data?.doctors || data?.data || []);
        setDoctors(doctorsList);
        setFiltered(doctorsList);
      } catch (err) {
        console.error('Error loading doctors:', err);
        // Extract more detailed error message
        const errorMsg = err.response?.data?.message || err.message || t.doctors?.loadError || 'Failed to load doctors catalog.';
        setError(errorMsg);
        setDoctors([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [t]);

  useEffect(() => {
    let result = [...doctors];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((d) => {
        const fullName = `${d.firstName ?? ''} ${d.lastName ?? ''}`.toLowerCase();
        // Search in translated specialty name
        let specialtyName = '';
        if (d.specialtyId) {
          specialtyName = (getSpecialtyById(d.specialtyId, language) || '').toLowerCase();
        } else if (d.specialty) {
          specialtyName = (d.specialty || '').toLowerCase();
        }
        return fullName.includes(term) || specialtyName.includes(term);
      });
    }

    if (selectedSpecialtyId) {
      result = result.filter((d) => d.specialtyId === selectedSpecialtyId);
    }

    if (onlyInsurance) {
      result = result.filter((d) => d.worksWithHealthInsurance === true);
    }

    setFiltered(result);
  }, [search, onlyInsurance, selectedSpecialtyId, doctors, language]);

  return (
    <section>
      <header className="page-header">
        <div>
          <h2>{t.doctors.catalog}</h2>
          <p>{t.doctors.catalogSubtitle}</p>
        </div>

        <div className="doctor-filters">
          <input
            type="text"
            placeholder={t.doctors.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="specialty-filter-wrapper">
            <SpecialtySelector
              value={selectedSpecialtyId}
              onChange={(id) => setSelectedSpecialtyId(id || null)}
              placeholder={t.doctors.filterBySpecialty || 'All Specialties'}
            />
          </div>

          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={onlyInsurance}
              onChange={(e) => setOnlyInsurance(e.target.checked)}
            />
            {t.doctors.onlyInsurance}
          </label>
        </div>
      </header>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem' }}>{t.doctors.loading}</p>
        </div>
      )}
      {error && <ErrorBox message={error} />}

      {!loading && !error && filtered.length === 0 && (
        <ErrorBox message={t.doctors.noResults} />
      )}

      <div className="doctor-grid">
        {filtered.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
};