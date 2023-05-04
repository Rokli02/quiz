import { FC, useRef, MutableRefObject, Dispatch, SetStateAction, useEffect } from 'react'
import inheritStyles from '../styles.module.css';
import styles from './styles.module.css';
import { Button, Clock, setMessage } from '../../components';
import { useQuiz } from '../../providers/quiz.provider';
import { QuestionType, SelectedAnswer } from '../../models';
import { useNavigate } from 'react-router-dom';
import { QuestionAnswers } from './QuestionAnswers';

export const QuestionPage: FC = () => {
  const navigate = useNavigate();
  const { correctAnswers, wrongAnswers, question, questionCount, counterTime, event, giveAnswer, getNextQuestion } = useQuiz();
  const selected = useRef<SelectedAnswer[]>([]);

  useEffect(() => {
    if (event === 'correct') {
      setMessage('Helyes válasz 😍', 'success');
    } else if (event === 'wrong') {
      setMessage('Ez most nem sikerült 😥', 'error');
    }
  }, [event])
  
  
  return (
    <div className={`${inheritStyles["container"]} ${styles["container"]}`}>
      <header className={styles["header-container"]}>
        <Clock
          event={event}
          counterTime={counterTime}
          onEnd={() => navigate('/summary', { replace: true })}
          onTimeOut={onAnswer.bind({ selected, giveAnswer })}
        />
        <div className={inheritStyles["container-title"]}>{question?.question}</div>
        <div className={inheritStyles["container-title"]}>{correctAnswers + wrongAnswers}/{questionCount}</div>
      </header>
      <QuestionAnswers selected={selected} onClick={onClick} />
      <footer className={styles["footer"]}>
        <div>
          {
            event === 'correct' || event === 'wrong'
            ? <Button type='button' onClick={onNext.bind({ selected, getNextQuestion })}>{ correctAnswers + wrongAnswers >= questionCount ? 'Befejezés' : 'Következő' }</Button>
            : <Button type='button' onClick={onAnswer.bind({ selected, giveAnswer })}>Elfogad</Button>
          }
        </div>
      </footer>
    </div>
  );
}

// Ne az indexet adja át, hanem a válasz objektumot
function onClick(this: { selected: MutableRefObject<SelectedAnswer[]>, tick: Dispatch<SetStateAction<boolean>>, answer: SelectedAnswer, type: QuestionType }) {
  let indexOf;

  switch (this.type) {
    case 'multi':
      indexOf = this.selected.current.findIndex((s) => s.pAnswer === this.answer.pAnswer);

      if (indexOf > -1) {
        this.selected.current.splice(indexOf, 1);
      } else {
        this.selected.current.push({ pAnswer: this.answer.pAnswer });
      }

      break;
    case 'single':
      this.selected.current = [{ pAnswer: this.answer.pAnswer }];

      break;
    case 'match':
      indexOf = this.selected.current.findIndex((s) =>
        s.pAnswer === this.answer.pAnswer && s.sAnswer === this.answer.sAnswer
      );

      if (indexOf > -1) {
        this.selected.current.splice(indexOf, 1);
      }

      break;
    default:
      throw new Error('Unexpected question type');
  }

  this.tick(pre => !pre);
}

function onAnswer(this: { selected: MutableRefObject<SelectedAnswer[]>, giveAnswer: (answers?: SelectedAnswer[] | undefined) => void }) {
  if (this.selected.current?.length === 0) {
    setMessage('Nem adtál meg választ!')
  } else {
    this.giveAnswer(this.selected.current);
  }
}

function onNext(this: { getNextQuestion: () => void, selected: MutableRefObject<SelectedAnswer[]> }) {
  this.selected.current = [];
  this.getNextQuestion();
}