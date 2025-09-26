import { createContext, useContext, useReducer } from 'react';

import data from '../data/questions';

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [...data],
  status: 'ready',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case 'newAnswer': {
      const question = state.questions[state.index];

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.highscore < state.points ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...initialState,
        highscore: state.highscore,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };
    default:
      throw new Error('Something went wrong!');
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const totalPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  if (questions.length === 0) return <h1>No questions available.</h1>;
  return (
    <QuizContext
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        totalPoints,
        dispatch,
      }}
    >
      {children}
    </QuizContext>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  return context;
}

// eslint-disable-next-line
export { QuizProvider, useQuiz };
