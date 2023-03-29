import { QuizService } from "../api";
import { Question } from "../models";

export const quizReducerInit: QuizReducerState = {
  counterTime: 30,
  questions: [],
  questionIndex: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  magicWord: '',
  event: 'init',
};

export type QuizReducerAction = {
  type: 'INIT' | 'ANSWER' | 'OUT_OF_TIME' | 'START' | 'NEXT' | 'MAGIC' | 'DISSIPATE',
  payload?: Partial<QuizReducerState> & Partial<QuizReducerPayloads>,
  callback?: () => void;
};

type QuizReducerPayloads = {
  selectedAnswers: number[];
  questionCount: number;
};

export type QuizReducerState = {
  counterTime: number;
  questions: Question[];
  questionIndex: number;
  correctAnswers: number;
  wrongAnswers: number;
  magicWord: string;
  event: QuizReducerEvents;
};

export type QuizReducerEvents = 'init' | 'start' | 'correct' | 'wrong' | 'end' | 'next';

export function quizReducer(state: QuizReducerState, action: QuizReducerAction): QuizReducerState {
  switch (action.type) {
    default:
    case 'INIT':
      return {
        ...quizReducerInit,
        magicWord: state.magicWord,
      }
    case 'DISSIPATE':
      return {
        ...quizReducerInit,
      }
    case 'START':
      if (!state.magicWord) {
        return {
          ...quizReducerInit,
        };
      }

      const questions = QuizService.getQuestions(action.payload?.questionCount || 30, state.magicWord)
      const newState: QuizReducerState = {
        correctAnswers: quizReducerInit.correctAnswers,
        wrongAnswers: quizReducerInit.wrongAnswers,
        counterTime: action.payload?.counterTime || quizReducerInit.counterTime,
        questionIndex: quizReducerInit.questionIndex,
        questions,
        magicWord: state.magicWord,
        event: 'start',
      }

      if (!newState.questions?.length) {
        return {
          ...quizReducerInit,
          magicWord: state.magicWord,
        }
      }

      return newState;
    case 'MAGIC':
      try {
        QuizService.tryMagicWord(action.payload?.magicWord);
  
        return {
          ...quizReducerInit,
          magicWord: action.payload?.magicWord!,
          event: 'correct',
        }
      } catch (err) {
        return {
          ...state,
          event: 'wrong',
        };
      }
    case 'ANSWER':
      try {
        QuizService.isAnswerRight(action.payload?.selectedAnswers as number[], state.questions?.[state.questionIndex].answers);

        return {
          ...state,
          correctAnswers: state.correctAnswers + 1,
          event: 'correct',
        }
      } catch (err) {
        return {
          ...state,
          wrongAnswers: state.wrongAnswers + 1,
          event: 'wrong',
        }
      }
    case 'NEXT': {
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        event: (state.questionIndex + 1) >= state.questions.length ? 'end' : 'next',
      }
    }
  }
};
