import { FC, ReactNode } from 'react';
import styles from './styles.module.css'
import { useQuiz } from '../../providers/quiz.provider';
import { QuizReducerEvents } from '../../reducers/quiz.reducer';

type AnswerProps = {
  children: ReactNode;
  highlight?: boolean;
  isCorrect?: boolean;
  onClick?: () => void;
}

export const Answer: FC<AnswerProps> = ({ children, highlight, isCorrect, onClick }) => {
  const { event } = useQuiz();

  return (
    <div
      className={`
        ${styles["answer-item"]}
        ${evaluatedHighlight(event, highlight, isCorrect)}
      `}
      onClick={event !== 'correct' && event !== 'wrong' ? onClick : () => null}
    >
      {children}
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

  if ((event === 'wrong' && highlight && isCorrect) || (event === 'correct' && highlight && isCorrect)) {
    return styles["correct"];
  }

  if (event === 'wrong' && highlight && !isCorrect) {
    return styles["wrong"];
  }

  if (event === 'wrong' && !highlight && isCorrect) {
    return styles["missed-correct"];
  }

  return '';
}