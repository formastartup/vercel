import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "A_FAZER",
  IN_PROGRESS = "EM_PROGRESSO",
  IN_REVIEW = "EM_REVISAO",
  DONE = "CONCLUIDO",
}

export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  workspaceId: string;
  description?: string
};
