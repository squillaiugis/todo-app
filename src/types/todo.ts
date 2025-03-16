/**
 * Type representing task priority
 * @typedef {'high' | 'medium' | 'low'} TaskPriority
 */
export type TaskPriority = "high" | "medium" | "low";

/**
 * Type representing task filter state
 * @typedef {'all' | 'active' | 'completed'} TaskFilter
 */
export type TaskFilter = "all" | "active" | "completed";

/**
 * Interface representing a task
 * @interface Task
 * @property {string} id - Unique identifier for the task
 * @property {string} text - Task content
 * @property {TaskPriority} priority - Task priority
 * @property {boolean} completed - Task completion status
 */
export interface Task {
  id: string;
  text: string;
  priority: TaskPriority;
  completed: boolean;
}
