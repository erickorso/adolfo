export type ModuleProgressVM = {
  moduleId: string;
  completedSlugs: string[];
  quizPassedSlugs: string[];
  totalLessons: number;
  completedCount: number;
  percent: number;
  totalXp: number;
  streakDays: number;
  isLoggedIn: boolean;
};

export type LessonToggleResult = {
  completed: boolean;
  progress: ModuleProgressVM;
};
