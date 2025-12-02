import { Link } from 'react-router-dom';

export const DoctorCard = ({ doctor }) => {
  return (
    <article className="doctor-card">
      <div className="doctor-card-avatar">
        <img
          src={doctor.imageUrl || 'https://via.placeholder.com/80?text=Dr'}
          alt={`${doctor.firstName} ${doctor.lastName}`}
        />
      </div>

      <div className="doctor-card-main">
        <h3>
          {doctor.title ? `${doctor.title} ` : ''}
          {doctor.firstName} {doctor.lastName}
        </h3>
        {doctor.specialty && <p className="doctor-specialty">{doctor.specialty}</p>}

        {doctor.practiceAddress && (
          <p className="doctor-address">{doctor.practiceAddress}</p>
        )}

        <div className="doctor-meta">
          {doctor.worksWithHealthInsurance && (
            <span className="badge badge-nhif">По здравна каса</span>
          )}

          {doctor.pricePrivate && (
            <span className="badge">
              Частен преглед: {doctor.pricePrivate} лв
            </span>
          )}
        </div>
      </div>

      <div className="doctor-card-actions">
        <Link to={`/doctors/${doctor.id}`} className="btn-primary">
          View Details
        </Link>
      </div>
    </article>
  );
};