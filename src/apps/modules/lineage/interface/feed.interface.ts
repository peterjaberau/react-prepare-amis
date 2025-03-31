
import { Operation } from 'fast-json-patch';

export type ThreadUpdatedFunc = (
  threadId: string,
  postId: string,
  isThread: boolean,
  data: Operation[]
) => void;

export interface EntityFieldThreadCount {
  entityLink: string;
  mentionCount: number;
  totalTaskCount: number;
  openTaskCount?: number;
  closedTaskCount?: number;
  conversationCount?: number;
}

export interface FeedCounts {
  conversationCount: number;
  totalTasksCount: number;
  openTaskCount: number;
  closedTaskCount: number;
  totalCount: number;
  mentionCount: number;
}
