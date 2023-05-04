export type AnswerType = {
  index: number;
  text: string;
  isCorrect?: boolean;
  mateIndex?: number;
  isPrimary?: boolean;
};


export type SelectedAnswer = {
  text?: string;
  textArray?: string[];
  pAnswer: number;
  sAnswer?: number;
  correctPair?: {
    pAnswer?: number;
    sAnswer?: number;
  }
};