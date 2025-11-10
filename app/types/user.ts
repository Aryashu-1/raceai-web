// src/types/user.ts

export type UserRole = "STUDENT" | "RESEARCHER" | "PROFESSOR" | "ADMIN";

export interface Institution {
  id: string;
  name: string;
  metadata?: Record<string, any> | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName:String;
  email: string;
  role: UserRole;

  preferences?: Record<string, any> | null;
  subscription?: string | null;

  institutionId?: string | null;
  institution?: Institution | null;

  github?: string | null;
  linkedin?: string | null;
  googleScholar?: string | null;
  orcid?: string | null;
  hIndex?: number | null;
  biography?: string | null;

  // optional relations (we usually don’t include full nested arrays on the frontend)
  projects?: string[]; // or you can later replace with Project[] if needed
  createdAt: string; // ISO string from backend
  updatedAt: string;
}
