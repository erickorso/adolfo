/** Contratos del módulo de cursos. */

export type CourseVM = {
  id: string;
  title: string;
  provider: string;
  url: string;
  hours: number;
  modality: string;
  sector: string | null;
  location: string | null;
  targetAudience: string | null;
  free: boolean;
};

export type CourseDetailVM = CourseVM & {
  description: string | null;
  source: string;
};

export type CourseEnrollmentVM = {
  id: string;
  enrolledAt: Date;
  course: CourseVM;
};

export type CourseSearchQuery = {
  q?: string;
  minHours?: number;
  location?: string;
  modality?: string;
};
