import { FC } from 'react';
import styles from './styles.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import { useQuiz } from '../providers/quiz.provider';

export const Header: FC = () => {
  const { dissipate, isLogedIn } = useQuiz();

  return (
    <header className={styles["header-container"]}>
      <div className={styles["header-item"]}>
      </div>
      <div className={styles["header-item"]}>
        <span>Quiz</span>
      </div>
      <div className={`${styles["header-item"]} ${styles["logout"]}`}>
        {isLogedIn && 
        <IconButton onClick={dissipate} className={styles["logout-button"]}>
          <LogoutIcon fontSize='medium'/>
        </IconButton>}
      </div>
    </header>
  )
}