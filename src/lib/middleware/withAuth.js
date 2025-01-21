import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (Component) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/');
      }
    }, []);

    return <Component {...props} />;
  };
};

export default withAuth;
