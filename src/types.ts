// declare here all the common types and avoid possible circular dependencies
export type Tech = {
  tech: string;
  experience: number;
};

export type TechStack = Tech[];

export type CandidateResume = {
  id: string;
  userId: string;
  resume: string;
  techStack: string[];
  detailedTechStack: TechStack;
  createdAt: string;
  updatedAt: string;
};
