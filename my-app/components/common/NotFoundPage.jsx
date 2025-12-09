import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <section className="notfound-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </section>
  );
};
