import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './components/Sidebar';
import styles from '../styles/dashboard.scss';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make GET request to check authentication status
        const res = await axios.get("@/api/auth/status", {
          withCredentials: true, // Include cookies if necessary
        });

        console.log("Authentication check response:", res.data);

        // Set authentication state based on backend response
        setIsAuthenticated(res.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false); // In case of an error, set authenticated to false
      }
    };

    checkAuth(); // Check authentication on mount
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    router.push('/login'); // Redirect to login if not authenticated
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.content}>
        <h2>Welcome to the Dashboard</h2>
        <p>Manage your app data here.</p>
      </div>
    </div>
  );
}
