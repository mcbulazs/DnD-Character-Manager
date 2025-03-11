export type Tracker = {
  id: number;
  name: string;
  type: string;
  maxValue: number;
  currentValue: number;
  order: number;
};

export type CreateTracker = {
  name: string;
  maxValue: number;
};
