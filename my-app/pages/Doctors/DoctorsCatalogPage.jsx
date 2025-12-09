import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { DoctorCard } from '../../components/doctors/DoctorCard';
import { ErrorBox } from '../../components/common/ErrorBox';

export const DoctorsCatalogPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [onlyInsurance, setOnlyInsurance] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await doctorService.getAll();
        setDoctors(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load doctors catalog.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = [...doctors];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((d) => {
        const fullName = `${d.firstName ?? ''} ${d.lastName ?? ''}`.toLowerCase();
        const specialty = (d.specialty ?? '').toLowerCase();
        return fullName.includes(term) || specialty.includes(term);
      });
    }

    if (onlyInsurance) {
      result = result.filter((d) => d.worksWithHealthInsurance === true);
    }

    setFiltered(result);
  }, [search, onlyInsurance, doctors]);

  return (
    <section>
      <header className="page-header">
        <div>
          <h2>Doctors Catalog</h2>
          <p>
            Изберете лекар от нашия каталог и запазете онлайн час за преглед.
          </p>
        </div>

        <div className="doctor-filters">
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={onlyInsurance}
              onChange={(e) => setOnlyInsurance(e.target.checked)}
            />
            Only NHIF doctors
          </label>
        </div>
      </header>

      {loading && <p>Loading doctors...</p>}
      {error && <ErrorBox message={error} />}

      {!loading && !error && filtered.length === 0 && (
        <ErrorBox message="No doctors match your criteria." />
      )}

      <div className="doctor-grid">
        {filtered.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
};