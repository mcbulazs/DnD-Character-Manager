export type NoteCategory = {
  id: number;
  name: string;
  description: string;
  notes: Note[];
};

export type CreateNoteCategory = {
  name: string;
  description: string;
};

export type Note = {
  id: number;
  note: string;
};
