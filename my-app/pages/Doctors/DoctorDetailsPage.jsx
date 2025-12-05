import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';

export const DoctorDetailsPage = () => {
  const { doctorId } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await doctorService.getById(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load doctor details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return (
      <section>
        <p>Loading doctor details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <p className="error">{error}</p>
      </section>
    );
  }

  if (!doctor) {
    return (
      <section>
        <p>Doctor not found.</p>
      </section>
    );
  }

  return (
    <section className="doctor-details">
      <div className="doctor-details-header">
        <img
          src={doctor.imageUrl || 'https://via.placeholder.com/120?text=Dr'}
          alt={`${doctor.firstName} ${doctor.lastName}`}
        />

        <div>
          <h2>
            {doctor.title ? `${doctor.title} ` : ''}
            {doctor.firstName} {doctor.lastName}
          </h2>

          {doctor.specialty && (
            <p className="doctor-specialty">{doctor.specialty}</p>
          )}

          {doctor.practiceAddress && (
            <p className="doctor-address">{doctor.practiceAddress}</p>
          )}

          <div className="doctor-meta">
            {doctor.worksWithHealthInsurance && (
              <span className="badge badge-nhif">Работи по НЗОК</span>
            )}
            {doctor.pricePrivate && (
              <span className="badge">
                Частен преглед: {doctor.pricePrivate} лв
              </span>
            )}
          </div>
        </div>
      </div>

      {doctor.bio && (
        <section className="doctor-section">
          <h3>About the doctor</h3>
          <p>{doctor.bio}</p>
        </section>
      )}

      <section className="doctor-section">
        <h3>Schedule & Booking</h3>

        {successMsg ? (
          <p className="success">{successMsg}</p>
        ) : (
          <>
            {!selectedSlot && (
              <BookingSlots
                doctor={doctor}
                onSelect={(slot) => setSelectedSlot(slot)}
              />
            )}

            {selectedSlot && (
              <BookingForm
                doctor={doctor}
                selectedSlot={selectedSlot}
                onSuccess={(res) => {
                  setSuccessMsg('Your appointment was successfully booked!');
                }}
              />
            )}
          </>
        )}
      </section>
      
    </section>
  );
};