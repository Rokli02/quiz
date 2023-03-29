import { FC } from "react";
import { useQuiz } from "../../providers/quiz.provider";
import { NavigateFunction, useNavigate } from "react-router-dom";
import inheritStyles from '../styles.module.css';
import styles from './summary.module.css';
import { Button } from "../../components";

export const SummaryPage: FC = () => {
  const { correctAnswers, questionCount, reInit } = useQuiz();
  const navigate = useNavigate();

  return (
    <div className={inheritStyles["container"]}>
      <div className={inheritStyles["container-title"]}>Összesítő</div>
      <article className={styles["summary-container"]}>
        <div className={styles["summary-text"]}>{questionCount} kérdésből {correctAnswers} kérdésre adtál helyes választ!</div>
        <br/>
        <div className={styles["summary-text"]}>{(correctAnswers / questionCount * 100).toFixed(1)}%</div>
      </article>
      <footer className={styles["action-footer"]}>
        <Button name="back" type="button" onClick={getBack.bind({ navigate, reInit })}>Vissza a beállításokhoz</Button>
      </footer>
    </div>
  );
}

function getBack(this: { navigate: NavigateFunction, reInit: () => void }) {
  this.reInit();
  this.navigate('/select', { replace: true });
}