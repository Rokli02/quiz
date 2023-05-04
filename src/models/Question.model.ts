import { AnswerType } from "./Answer.model";

export type Question = {
  _id: number;
  question: string;
  answers: AnswerType[];
  type: QuestionType;
};

export type QuestionType = 'single' | 'multi' | 'match';

