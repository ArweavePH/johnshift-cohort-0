export interface PollItem {
  id: string;
  owner: string;
  timestamp: number;
  txTimestamp: number | null;
  title: string;
  options: string[];
}

export interface PollSelection {
  owner: string;
  selection: string;
  timestamp: number;
}
