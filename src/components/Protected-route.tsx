import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../providers/quiz.provider';
import { setMessage } from './snackbar/snackbar';

export type ProtectedRouteProps = {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isLogedIn } = useQuiz();

  useEffect(() => {
    if (!isLogedIn) {
      setMessage('😠 Nem szabad ilyet 😡', 'error');
      navigate('/', { replace: true })
    }
  }, []);

  return <div>{isLogedIn ? children : ''}</div>
};