import { Dispatch, FC, MutableRefObject, SetStateAction, useRef, useState, useEffect } from "react";
import { AnswerType , SelectedAnswer } from "../../models";
import { Answer } from "../../components";
import styles from './styles.module.css';
import { useQuiz } from "../../providers/quiz.provider";

export type QuestionAnswersProps = {
  selected: MutableRefObject<SelectedAnswer[]>;
  onClick: () => void;
}

export const QuestionAnswers: FC<QuestionAnswersProps> = ({ selected, onClick }) => {
  const { question, event } = useQuiz();
  const [, tick] = useState(false);
  const selection = useRef<Partial<SelectedAnswer>>({ pAnswer: undefined, sAnswer: undefined, textArray: [] });

  useEffect(() => {
    // a 'selected' tömb kibővítése a még jó válaszokkal
    if (event === 'wrong') {
      const metadata = question.answers.reduce((sum, cur) => {
        if (cur.isPrimary) {
          sum.primaryCount++;
        }

        return sum;
      }, { primaryCount: 0});

      for (let i = 0; i < question.answers.length; i++) {
        const answer = question.answers[i];
        let tempSelectedAnswer: SelectedAnswer;

        if (!answer.isPrimary) {
          continue;
        }

        tempSelectedAnswer = {
          pAnswer: answer.index,
          sAnswer: answer.mateIndex,
          text: `${answer.index + 1} - ${answer.mateIndex ? answer.mateIndex - metadata.primaryCount + 1 : '()'}`
        }

        const indexOfSelected = selected.current.findIndex((sa) => 
          sa.pAnswer === tempSelectedAnswer.pAnswer && sa.sAnswer === tempSelectedAnswer.sAnswer
        );
        
        if (indexOfSelected <= -1) {
          selected.current.push(tempSelectedAnswer);
        }
      }

      selected.current.sort((a, b) => a.pAnswer - b.pAnswer);

      tick(pre => !pre);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  switch (question?.type) {
    case 'single':
    case 'multi':
      {
        return <article className={styles["answers-container"]}>
          {question?.answers?.map((answer, index) => (
            <Answer
              key={index}
              isCorrect={answer.isCorrect}
              highlight={selected.current.some((s) => s.pAnswer === answer.index)}
              onClick={onClick.bind({ selected, tick, answer, type: question.type })}
            >
              {answer.text}
            </Answer>
            ))
          }
        </article>
      }
    case 'match':
      {
        return (
          <article className={styles["match-container"]}>
            <div className={styles["primary-answers"]}>
              {
                question?.answers?.filter(e => e.isPrimary)
                  .map((answer, i) => {
                    const index = i + 1;

                    return <Answer
                      key={index}
                      index={index}
                      isCorrect={answer.isCorrect}
                      highlight={selection.current.pAnswer === answer.index}
                      onClick={makeAnswerPair.bind({ type: 'primary', tick, index, selection, selected, answer })}
                    >
                      {answer.text}
                    </Answer>
                  })
              }
            </div>
            <hr className={styles["answer-hr"]}/>
            <div className={styles["match-answers"]}>
              {
                selected.current.map((answer, index) => (
                  <Answer
                      key={index}
                      highlight={answer.correctPair !== undefined && (event === 'correct' || event === 'wrong')}
                      isCorrect={answer.pAnswer === answer.correctPair?.pAnswer && answer.sAnswer === answer.correctPair?.sAnswer}
                      onClick={onClick.bind({ selected, tick, answer, type: question.type })}
                    >
                      {answer.text}
                    </Answer>
                ))
              }
            </div>
            {
              selected.current.length !== 0
                ? <hr className={styles["answer-hr"]}/>
                : undefined
            }
            <div className={styles["secondary-answers"]}>
              {
                question?.answers?.filter(e => !e.isPrimary)
                  .map((answer, i) => {
                    const index = i + 1;

                    return <Answer
                      key={index}
                      index={index}
                      isCorrect={answer.isCorrect}
                      highlight={selection.current.sAnswer === answer.index}
                      onClick={makeAnswerPair.bind({ type: 'secondary', tick, index, selection, selected, answer })}
                    >
                      {answer.text}
                    </Answer>
                  })
              }
            </div>
          </article>
        );
      }
    default:
      return (<div></div>);
  }
}

function makeAnswerPair(
  this: {
    selection: MutableRefObject<Partial<SelectedAnswer>>,
    selected: MutableRefObject<SelectedAnswer[]>,
    tick: Dispatch<SetStateAction<boolean>>,
    answer: AnswerType,
    index: number | string,
    type: 'primary' | 'secondary' 
  }
) {
  if (!Array.isArray(this.selection.current.textArray)) {
    this.selection.current.textArray = [];
  }

  switch (this.type) {
    case 'primary':
      this.selection.current.textArray[0] = this.index.toString();

      if (this.selection.current.pAnswer === this.answer.index) {
        this.selection.current.pAnswer = undefined;
        break;
      }

      this.selection.current.pAnswer = this.answer.index;
      break;
      case 'secondary':
      this.selection.current.textArray[1] = this.index.toString();

      if (this.selection.current.sAnswer === this.answer.index) {
        this.selection.current.sAnswer = undefined;
        break;
      }

      this.selection.current.sAnswer = this.answer.index;
      break;
    default:
      throw new Error('Unexpected answer type in pairing');
  }

  if (
    this.selection.current.pAnswer !== undefined &&
    this.selection.current.sAnswer !== undefined
  ) {
    this.selection.current.correctPair = this.answer.isPrimary 
      ? {
          pAnswer: this.answer.index,
          sAnswer: this.answer.mateIndex,
        }
      : {
          pAnswer: this.answer.mateIndex,
          sAnswer: this.answer.index,
        }

    this.selection.current.text = this.selection.current.textArray.join(' - ');

    const foundInSelected = this.selected.current.findIndex(
      (value) => 
        value.pAnswer === this.selection.current.pAnswer ||
        value.sAnswer === this.selection.current.sAnswer
    )

    if (foundInSelected === -1) {
      this.selected.current.push({ ...this.selection.current} as SelectedAnswer);
      this.selected.current.sort((a, b) => a.pAnswer - b.pAnswer);
    }

    this.selection.current = { pAnswer: undefined, sAnswer: undefined, textArray: [] };
  }

  this.tick((pre) => !pre);
}