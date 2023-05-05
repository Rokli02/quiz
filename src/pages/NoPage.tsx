import { useNavigate } from "react-router-dom";
import { FC, useEffect } from 'react';
import config from './config';

export const NoPage: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(config.base, { replace: true })
  }, []);

  return (
    <div></div>
  )
}