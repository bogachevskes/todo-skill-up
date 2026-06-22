export interface IBoard {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: IOwner;
}

export interface IOwner {
  id: number;
  name: string;
  email: string;
}

export interface IBoardForm {
  id?: number;
  name: string | null;
  description: string | null;
}