import type { Dayjs } from 'dayjs';

export interface IStatusResponse {
  status: IStatus;
  tasks: ITask[];
}

export interface IStatus {
  boardId: number;
  createdAt: string;
  id: number;
  name: string;
}

export interface ITask {
  boardId: number;
  createdAt: string;
  description: string;
  id: number;
  name: string;
  plannedCompletionAt: string;
  statusId: number;
}

export interface IStatusForm {
  name: string | null;
}

export interface ITaskForm {
  description: string | null;
  name: string | null;
  plannedCompletionAt: Dayjs | string | null;
}
