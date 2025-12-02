import { useAuth } from '../../hooks/useAuth.js';

export const LoginPage = () => {
  const { login } = useAuth();

  const handleDemoLogin = (e) => {
    e.preventDefault();
    // временно демо – ще го сменим с API call
    login(
      {
        id: 'demo-user',
        email: 'user@example.com',
        firstName: 'Demo',
        lastName: 'User',
        role: 'USER',
      },
      'fake-jwt-token',
    );
  };

  return (
    <section>
      <h2>Login</h2>
      <p>
        Тук ще има реална login форма. В момента има демо бутон за бърз вход.
      </p>
      <button onClick={handleDemoLogin}>Demo Login as User</button>
    </section>
  );
};