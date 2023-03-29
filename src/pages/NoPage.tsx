import { useNavigate } from "react-router-dom";
import { FC, useEffect } from 'react';

export const NoPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true })
  }, []);

  return (
    <div></div>
  )
}