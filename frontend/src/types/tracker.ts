export type Tracker = {
    ID: number;
    name: string;
    type: string;
    maxValue: number;
    currentValue: number;
}

export type CreateTracker = {
    name: string;
    maxValue: number;
}