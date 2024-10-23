import { useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/use-toast';

interface DecodedToken extends JwtPayload {
  exp: number;
}

const UseTokenExpiration = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token') || '';
    
      if (token === '') {
        console.log("UseTokenExpiration LAYOUT")
        // navigate('/login');
        return;
      }
    
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
    
        if (expirationTime < Date.now()) {
          toast({
            variant: "info",
            title: "Session Expired",
            description: "Logging You out! Please login again"
          });
          localStorage.removeItem('token');
          console.log("UseTokenExpiration LAYOUT")
          navigate('/login');
        }
      } catch (error) {
        localStorage.removeItem('token');
        console.log("UseTokenExpiration LAYOUT")
        navigate('/login');
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  return null;
};

export default UseTokenExpiration;
