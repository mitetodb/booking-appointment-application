import { useParams } from 'react-router-dom';

export const DoctorDetailsPage = () => {
  const { doctorId } = useParams();

  return (
    <section>
      <h2>Doctor Details</h2>
      <p>Details for doctor: {doctorId}</p>
      <p>Тук по-късно ще има график и форма за записване на час.</p>
    </section>
  );
};