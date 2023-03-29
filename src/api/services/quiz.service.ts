import { AnswerType, Question } from '../../models/Question.model';
import datas from '../datas.json';

export const getQuestions = (questionCount = 50, magicWord = ''): Question[] => {
  const upperBound = datas.questions.length;
  const size = Math.min(questionCount, upperBound);
  let questionIndexes: number[];

  let qIndex = 0, randomNum = 0;

  if (questionCount > upperBound) {
    questionIndexes = Array.from<number>(Array(size).keys());
  } else {
    questionIndexes = [];
    while (qIndex < size) {
      randomNum = Math.random() * (upperBound - 1) >> 0;
  
      if (questionIndexes.indexOf(randomNum) === -1) {
        qIndex = questionIndexes.push(randomNum);
      }
    }
  }

  return questionIndexes.map((index, _id) => {
    const row =  datas.questions[index].split(';');
    const corrects = row[1].split('_').map((r) => Number(r));
    const answers: AnswerType[] = [];

    if (corrects.length > 1) {
      for (let col = 2; col < row.length; col++) {
        answers.push({ text: row[col], isCorrect: corrects.includes(col - 1)});
      }

      return {
        _id,
        question: `${row[0]}\n(Több válasz is megjelölhető)`,
        type: 'multi',
        answers: answers//row.(0, 2).map((answer, i) => ({ text: answer, isCorrect: corrects.includes(i + 1)}) as Answer),
      } as Question;
    } else {
      for (let col = 2; col < row.length; col++) {
        answers.push({ text: row[col], isCorrect: (col - 1) === corrects[0]});
      }

      return {
        _id,
        question: `${row[0]}\n(Egy válasz jelölhető meg)`,
        type: 'single',
        answers: answers//row.slice(0, 2).map((answer, i) => ({ text: answer, isCorrect: (i + 1) === corrects[0]}) as Answer),
      } as Question;
    }
  });
}

export const isAnswerRight = (givenAnswers: number[], answer: AnswerType[]): void => {
  if (!givenAnswers || givenAnswers?.length === 0) {
    throw new Error();
  }
  
  givenAnswers.sort((a, b) => a - b);

  if (givenAnswers?.every((index) => !answer[index].isCorrect)) {
    throw new Error();
  }
}

export const tryMagicWord = (w?: string): void => {
  if (!w) {
    throw new Error();
  }

  // Dekódolás teszt
  if (datas.w !== w) {
    throw new Error();
  }
  // ha hibás -> error
}