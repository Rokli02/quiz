import { FC, ReactNode } from 'react';
import styles from './styles.module.css'
import { useQuiz } from '../../providers/quiz.provider';
import { QuizReducerEvents } from '../../reducers/quiz.reducer';

type AnswerProps = {
  index?: number;
  children: ReactNode;
  highlight?: boolean;
  isCorrect?: boolean;
  onClick?: () => void;
}

export const Answer: FC<AnswerProps> = ({ index, children, highlight, isCorrect, onClick }) => {
  const { event } = useQuiz();

  return (
    <div
      className={`
        ${styles["answer-item"]}
        ${evaluatedHighlight(event, highlight, isCorrect)}
      `}
      onClick={event !== 'correct' && event !== 'wrong' ? onClick : () => null}
    >
      {
        index !== undefined
          ? (
            <label className={styles["index-delimiter"]}>
              {index}
            </label>
          )
          : undefined
      }
      <span>{ children }</span>
    </div>
  );
}

const evaluatedHighlight = (event: QuizReducerEvents, highlight?: boolean, isCorrect?: boolean) => {
  if (event !== 'correct' && event !== 'wrong') {
    if (highlight) {
      return styles["highlight"];
    }

    return styles["active-answer"];
  }

  if ((event === 'wrong' || event === 'correct') && highlight && isCorrect) {
    return styles["correct"];
  }

  if ((event === 'wrong' || event === 'correct') && highlight && !isCorrect) {
    return styles["wrong"];
  }

  if (event === 'wrong' && !highlight && isCorrect) {
    return styles["missed-correct"];
  }

  return '';
}