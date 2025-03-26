import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/_login.scss';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth', { email, password });
      if (response.data.success) {
        router.push('/dashboard'); // Redirect to dashboard after successful login
      } else {
        setError(response.data.errorMessage);
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Sign In</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
