import { AnswerType, QuestionType, SelectedAnswer } from '../../models';
import { Question } from '../../models';
import datas from '../datas.json';

export const getQuestions = (questionCount = 50, magicWord = ''): Question[] => {
  const upperBound = datas.questions.length;
  const size = Math.min(questionCount, upperBound);
  let questionIndexes: number[];

  let qIndex = 0, randomNum = 0;

  // Kérdések random kiválasztása
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

  // A megkapott kérdés indexek alapján kérdések kivétele és általakítása
  return questionIndexes.map((index, _id) => {
    const row =  datas.questions[index].split(';');
    const corrects = row[1].split('_').map((r) => r);
    const answers: AnswerType[] = [];

    // FIX: Bug, ha az primary indexen 2 helyes opció is van, akkor csak az utolsót jegyzi meg, a többit eldobja, így nem tud jól ellenőrizni
    // Összepárosításos
    if (corrects.some((correct) => correct.includes('-'))) {
      const pairMap = new Map<number, any>();
      for (const correct of corrects) {
        const [primary, secondary] = correct.split('-');

        pairMap.set(Number(secondary) - 1, { pair: Number(primary) - 1, isPrimary: false });
        pairMap.set(Number(primary) - 1, { pair: Number(secondary) - 1, isPrimary: true });
      }

      for (let col = 2; col < row.length; col++) {
        const pair = pairMap.get(col - 2);
        answers.push({ index: (col - 2), text: row[col], mateIndex: pair?.pair, isPrimary: !!pair?.isPrimary });
      }

      return {
        _id,
        question: `${row[0]}\n(Párosítsd össze)`,
        type: 'match',
        answers: answers
      } as Question;
    }
    // Több helyes válasz
    else if (corrects.length > 1) {
      for (let col = 2; col < row.length; col++) {
        answers.push({ index: (col - 2), text: row[col], isCorrect: corrects.includes((col - 1).toString())});
      }

      return {
        _id,
        question: `${row[0]}\n(Több válasz is megjelölhető)`,
        type: 'multi',
        answers: answers
      } as Question;
    }
    // Egy helyes válasz
    else {
      for (let col = 2; col < row.length; col++) {
        answers.push({ index: (col - 2), text: row[col], isCorrect: (col - 1) === Number(corrects[0])});
      }

      return {
        _id,
        question: `${row[0]}\n(Egy válasz jelölhető meg)`,
        type: 'single',
        answers: answers
      } as Question;
    }
  });
}

// HA match típusú van, akkor nem boolean az isCorrect, hanem szám, ami a párjára mutat
export const isAnswerRight = (givenAnswers: SelectedAnswer[], answers: AnswerType[], type: QuestionType): void => {
  if (!givenAnswers || givenAnswers?.length === 0) {
    throw new Error();
  }

  let correctAnswers: number, hitAnswers: number;

  switch (type) {
    case 'single':
      if (givenAnswers.length !== 1 || !answers[givenAnswers[0].pAnswer].isCorrect) {
        throw new Error();
      }

      break;
    case 'multi':
      if (givenAnswers.length <= 1) {
        throw new Error();
      }

      correctAnswers = 0;
      hitAnswers = 0;
      givenAnswers.sort((a, b) => a.pAnswer - b.pAnswer);

      answers.forEach((a, index) => {
        if (a.isCorrect) {
          correctAnswers++;
        }

        if (givenAnswers.some((ga) => ga.pAnswer === index)) {
          hitAnswers++;
        }
      })

      if (correctAnswers !== hitAnswers) {
        throw new Error();
      }

      break;
    case 'match':
      if (givenAnswers.length <= 1) {
        throw new Error();
      }

      correctAnswers = 0;
      hitAnswers = answers.reduce((sum, answer) => 
        answer.isPrimary ? ++sum : sum,
        0
      );

      if (givenAnswers.length !== hitAnswers) {
        throw new Error();
      }

      for (const ga of givenAnswers) {
        if (ga.pAnswer === ga.correctPair?.pAnswer && ga.sAnswer === ga.correctPair.sAnswer) {
          correctAnswers++;
        }
      }

      if (correctAnswers !== hitAnswers) {
        throw new Error();
      }

      break;
    default:
      break;
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