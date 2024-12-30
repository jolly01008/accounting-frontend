import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const useRedirectSignIn = () => {
  const navigate = useNavigate();
  
  const redirectSignIn = () => {
    Swal.fire({
      icon: 'warning',
      title: '請先登入才可使用!',
      showConfirmButton: false,
      timer: 2400
    }).then(() => {
      navigate('/signin');
    });
  };

  return redirectSignIn;
};

export default useRedirectSignIn;