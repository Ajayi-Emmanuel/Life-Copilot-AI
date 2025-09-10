
export interface Task {
  id: string;
  text: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
}

export interface StressPoint {
  date: string; // YYYY-MM-DD
  stressLevel: number; // 1-10
}

export interface Recommendation {
  title: string;
  text: string;
}

export interface AiAnalysis {
  stressForecast: StressPoint[];
  recommendations: Recommendation[];
}
