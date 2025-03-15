// タスクの優先度を表す型
export type TaskPriority = "high" | "medium" | "low";

// タスクの状態を表す型
export type TaskFilter = "all" | "active" | "completed";

// タスクを表す型
export interface Task {
  id: string;
  text: string;
  priority: TaskPriority;
  completed: boolean;
}
