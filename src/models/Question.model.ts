export type Question = {
  _id: number;
  question: string;
  answers: AnswerType[];
  type: QuestionType;
};

export type QuestionType = 'single' | 'multi';

export type AnswerType = {
  text: string;
  isCorrect: boolean;
};
