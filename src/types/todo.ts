/**
 * タスクの優先度を表す型
 * @typedef {'high' | 'medium' | 'low'} TaskPriority
 */
export type TaskPriority = "high" | "medium" | "low";

/**
 * タスクのフィルター状態を表す型
 * @typedef {'all' | 'active' | 'completed'} TaskFilter
 */
export type TaskFilter = "all" | "active" | "completed";

/**
 * タスクを表すインターフェース
 * @interface Task
 * @property {string} id - タスクの一意識別子
 * @property {string} text - タスクの内容
 * @property {TaskPriority} priority - タスクの優先度
 * @property {boolean} completed - タスクの完了状態
 */
export interface Task {
  id: string;
  text: string;
  priority: TaskPriority;
  completed: boolean;
}
