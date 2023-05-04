import { createContext, useContext, FC, ReactNode, useReducer } from 'react';
import { QuizReducerAction, QuizReducerEvents, quizReducer, quizReducerInit } from '../reducers/quiz.reducer';
import { Question, SelectedAnswer } from '../models';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export type QuizContextProps = {
  counterTime: number;
  question: Question;
  questionCount: number;
  correctAnswers: number;
  wrongAnswers: number;
  event: QuizReducerEvents;
  reInit: () => void;
  dissipate: () => void;
  tryMagicWord: (word: string) => void;
  startQuiz: (numberOfQuestions?: number, counterTime?: number) => void;
  giveAnswer: (answers?: SelectedAnswer[]) => void;
  getNextQuestion: () => void;
  isLogedIn: boolean;
}

type QuizProviderProps = {
  children: ReactNode,
}

const initValues: QuizContextProps = {
  counterTime: 30,
  question: { _id: -1, question: '', answers: [], type: 'single'},
  questionCount: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  event: 'init',
  reInit: () => null,
  dissipate: () => null,
  tryMagicWord: () => null,
  startQuiz: () => null,
  giveAnswer: () => null,
  getNextQuestion: () => null,
  isLogedIn: false,
};

const QuizContext = createContext<QuizContextProps>(initValues);

export const QuizProvider: FC<QuizProviderProps> = ({children}) => {
  const [state, dispatch] = useReducer(quizReducer, quizReducerInit);
  const navigate = useNavigate();

  return (
    <QuizContext.Provider
      value={{
        correctAnswers: state.correctAnswers,
        wrongAnswers: state.wrongAnswers,
        counterTime: state.counterTime,
        question: state.questions[state.questionIndex],
        questionCount: state.questions.length,
        event: state.event,
        reInit: reInit.bind({ dispatch }),
        dissipate: dissipate.bind({ dispatch, navigate }),
        tryMagicWord: tryMagicWord.bind({ dispatch }),
        startQuiz: startQuiz.bind({ dispatch }),
        giveAnswer: giveAnswer.bind({ dispatch }),
        getNextQuestion: getNextQuestion.bind({ dispatch }),
        isLogedIn: state.magicWord !== '',
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function reInit(this: { dispatch: (value: QuizReducerAction) => void}) {
  setTimeout(() => this.dispatch({ type: 'INIT' }), 1500);
}

function dissipate(this: { dispatch: (value: QuizReducerAction) => void, navigate: NavigateFunction }) {
  this.dispatch({ type: 'DISSIPATE' });
  this.navigate('/', { replace: true });
}

function tryMagicWord(this: { dispatch: (value: QuizReducerAction) => void}, word: string) {
  this.dispatch({ type: 'MAGIC', payload: { magicWord: word } });
}

function startQuiz(this: { dispatch: (value: QuizReducerAction) => void}, numberOfQuestions?: number, counterTime?: number) {
  this.dispatch({ type: 'START', payload: { questionCount: numberOfQuestions, counterTime } });
}

function giveAnswer(this: { dispatch: (value: QuizReducerAction) => void}, answers?: SelectedAnswer[]) {
  this.dispatch({ type: 'ANSWER', payload: { selectedAnswers: answers } });
}

function getNextQuestion(this: { dispatch: (value: QuizReducerAction) => void}) {
  this.dispatch({ type: 'NEXT' });
}

export const useQuiz = () => useContext(QuizContext);