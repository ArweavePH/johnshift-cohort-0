import { CATEGORIES } from './constants';

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export type GameState = 'lobby' | 'playing' | 'result';

export interface User {
  wallet: string;
  name: string;
}

export interface Question {
  id: string;
  question: string;
  choices: string[];
  image: {
    question: string | undefined;
    answer: string | undefined;
  };
}

export interface Answer {
  user: User;
  questionId: string;
  selected: string;
  score: number;
}

export interface Game {
  id: string;
  category: Category;
  timeLimit: number;
  timeCreated: number;
  timeStarted: number | undefined;
  timeEnded: number | undefined;

  state: GameState;

  currentQuestionIndex: number;
  currentQuestion: Question | undefined;
  currentAnswer: string | undefined;

  host: string;
  players: User[];

  answers: Answer[] | undefined;
}

export interface GenericResponse<T = undefined> {
  success: boolean;
  message: string;
  data: T;
}

export interface GameListItem {
  gameId: string;
  state: GameState;
  timeCreated: number;
  timeStarted: number | undefined;
  timeEnded: number | undefined;
}
