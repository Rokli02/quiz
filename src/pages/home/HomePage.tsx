import { FC, useEffect } from "react";
import styles from './styles.module.css';
import inheritStyles from '../styles.module.css';
import { Input } from "../../components/input/Input";
import { Button } from "../../components";
import { useQuiz } from "../../providers/quiz.provider";
import { useNavigate } from "react-router-dom";
import { setMessage } from "../../components";
import config from '../config';

function onSubmit(this: { tryMagicWord: (word: string) => void }, e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  this.tryMagicWord((e.target as any)['magic-word']?.value);
}

export const HomePage: FC = () => {
  const { reInit, tryMagicWord, event } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    if (event === 'correct') {
      setMessage('Eltaláltad a varázsszót!', 'success');
      reInit();
      navigate(config.route.select, { replace: true });
    } else if (event === 'wrong') {
      setMessage('Nem nyert, még próbálkozz!', 'error');
      reInit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return (
    <div className={inheritStyles["container"]}>
      <div className={inheritStyles["container-title"]}>Jelentkezz be</div>
      <form onSubmit={onSubmit.bind({ tryMagicWord })} className={styles["form-container"]}>
        <Input name="magic-word" type="password" autoFocus>Add meg a varázsszót</Input>
        <Button name="submit-button" type="submit">Bevitel</Button>
      </form>
    </div>
  );
}