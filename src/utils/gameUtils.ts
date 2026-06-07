import { GameSession, GameQuestion } from '../types';

const STORAGE_KEY = 'arithmeticGame_sessions';

export const generateQuestion = (difficulty: 'easy' | 'medium' | 'hard'): GameQuestion => {
  const operations: ('+' | '-' | '*' | '/')[] = ['+', '-', '*', '/'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1, num2;
  
  if (difficulty === 'easy') {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
  } else if (difficulty === 'medium') {
    num1 = Math.floor(Math.random() * 50) + 1;
    num2 = Math.floor(Math.random() * 50) + 1;
  } else {
    num1 = Math.floor(Math.random() * 100) + 1;
    num2 = Math.floor(Math.random() * 100) + 1;
  }

  let answer = 0;
  switch (operation) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    case '/':
      // Ensure division results in a whole number
      answer = Math.floor(num1 / num2);
      num1 = answer * num2;
      break;
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    operation,
    num1,
    num2,
    answer: Math.floor(answer),
  };
};

export const saveGameSession = (session: GameSession) => {
  const sessions = getGameSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const getGameSessions = (): GameSession[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getDailyHighScore = (date: string): number => {
  const sessions = getGameSessions();
  const daySessions = sessions.filter(s => s.date === date);
  return daySessions.length > 0 ? Math.max(...daySessions.map(s => s.score)) : 0;
};

export const getGameStats = () => {
  const sessions = getGameSessions();
  if (sessions.length === 0) {
    return {
      totalGames: 0,
      totalScore: 0,
      bestScore: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
    };
  }

  const totalGames = sessions.length;
  const totalScore = sessions.reduce((acc, s) => acc + s.score, 0);
  const bestScore = Math.max(...sessions.map(s => s.score));
  const averageAccuracy = sessions.reduce((acc, s) => acc + (s.correctAnswers / s.totalQuestions), 0) / totalGames;
  const totalTimeSpent = sessions.reduce((acc, s) => acc + s.timeSpent, 0);

  return {
    totalGames,
    totalScore,
    bestScore,
    averageAccuracy,
    totalTimeSpent,
  };
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};
