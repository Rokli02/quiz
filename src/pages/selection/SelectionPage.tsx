import { FC } from "react";
import { useQuiz } from "../../providers/quiz.provider";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button, Input, setMessage } from "../../components";
import inheritStyles from '../styles.module.css';
import styles from './styles.module.css';

let timer: NodeJS.Timeout | undefined;

export const SelectionPage: FC = () => {
  const { startQuiz, event } = useQuiz();
  const navigate = useNavigate();

  return (
    <div className={inheritStyles["container"]}>
      <div className={inheritStyles["container-title"]}>Kérdések beállítása</div>
      <form onSubmit={onSubmit.bind({ startQuiz, navigate })} className={styles["form-container"]}>
        <Input name="question-count" type="number" min={0} autoFocus>Add meg a megválaszolandó kérdések számát!</Input>
        <Input name="round-time" type="number" min={0}>Add meg a körök idejét! (másodpercben)</Input>
        <Button name="submit-button" type="submit" disabled={event === 'end'}>Tovább</Button>
      </form>
    </div>
  );
}

function onSubmit(this: {
  startQuiz: (numberOfQuestions: number, counterTime: number) => void,
  navigate: NavigateFunction,
}, e: React.FormEvent<HTMLFormElement>) {
e.preventDefault();

if (timer) {
  clearTimeout(timer);
  timer = undefined;
}

const numberOfQuestions = (e.target as any)['question-count']?.value;
const counterTime = (e.target as any)['round-time']?.value;
setMessage('Jönnek a kérdések');
this.navigate('/question', { replace: true });
timer = setTimeout(() => {
  this.startQuiz(Number(numberOfQuestions), Number(counterTime))
}, 2500);
}