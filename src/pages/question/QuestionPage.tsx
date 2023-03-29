import { FC, useRef, useState, MutableRefObject, Dispatch, SetStateAction, useEffect } from 'react'
import inheritStyles from '../styles.module.css';
import styles from './styles.module.css';
import { Answer } from "../../components/answer/Answer";
import { Button, Clock, setMessage } from '../../components';
import { useQuiz } from '../../providers/quiz.provider';
import { QuestionType } from '../../models';
import { useNavigate } from 'react-router-dom';

export const QuestionPage: FC = () => {
  const navigate = useNavigate();
  const { correctAnswers, wrongAnswers, question, questionCount, counterTime, event, giveAnswer, getNextQuestion } = useQuiz();
  const selected = useRef<number[]>([]);
  const [, tick] = useState(false);

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
      <article className={styles["answers-container"]}>
        {question?.answers?.map((answer, index) => (
        <Answer
          key={index}
          isCorrect={answer.isCorrect}
          highlight={selected.current.includes(index)}
          onClick={onClick.bind({ selected, tick, index, type: question.type })}
        >
          {answer.text}
        </Answer>
        ))}
      </article>
      <footer className={styles["footer"]}>
        <div>
          {
            event === 'correct' || event === 'wrong'
            ? <Button type='button' onClick={onNext.bind({ selected, getNextQuestion })}>Következő</Button>
            : <Button type='button' onClick={onAnswer.bind({ selected, giveAnswer })}>Elfogad</Button>
          }
        </div>
      </footer>
    </div>
  );
}

function onClick(this: { selected: MutableRefObject<number[]>, tick: Dispatch<SetStateAction<boolean>>, index: number, type: QuestionType }) {
  let indexOf = this.selected.current.indexOf(this.index);
  if (this.type === 'multi') {
    if (indexOf > -1) {
      this.selected.current.splice(indexOf, 1);
    } else {
      this.selected.current.push(this.index);
    }
  } else if (this.type === 'single') {
    this.selected.current = [this.index];
  }

  this.tick(pre => !pre);
}

function onAnswer(this: { selected: MutableRefObject<number[]>, giveAnswer: (answers?: number[] | undefined) => void }) {
  if (this.selected.current?.length === 0) {
    setMessage('Nem adtál meg választ!')
  } else {
    this.giveAnswer(this.selected.current);
  }
}

function onNext(this: { getNextQuestion: () => void, selected: MutableRefObject<number[]> }) {
  this.selected.current = [];
  this.getNextQuestion();
}