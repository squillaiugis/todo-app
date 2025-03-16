import { Task } from "../types/todo";

/**
 * TodoStore class - Manages task storage in localStorage
 * @class
 */
export class TodoStore {
  #store: Storage;
  #key: string = "tasks";

  /**
   * Create a new TodoStore instance
   * @param {Storage} store - Storage instance (typically localStorage)
   */
  constructor(store: Storage) {
    this.#store = store;
  }

  /**
   * Validate if data conforms to Task interface
   * @private
   * @param {unknown} data - Data to validate
   * @returns {boolean} true if data is valid, false otherwise
   */
  private validate(data: unknown): data is Task {
    if (
      data &&
      typeof data === "object" &&
      "id" in data &&
      typeof data.id === "string" &&
      "text" in data &&
      typeof data.text === "string" &&
      "priority" in data &&
      (data.priority === "high" ||
        data.priority === "medium" ||
        data.priority === "low") &&
      "completed" in data &&
      typeof data.completed === "boolean"
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get all stored tasks
   * @returns {Task[]} Array of tasks
   * @throws {Error} If data format is invalid
   */
  getAll(): Task[] {
    const data = JSON.parse(this.#store.getItem(this.#key) || "[]");
    if (!Array.isArray(data)) {
      throw new Error("Invalid data format. Stored task data must be array.");
    }
    if (!data.every((v) => this.validate(v))) {
      throw new Error("Invalid task data format.");
    }
    return data;
  }

  /**
   * Filter tasks based on specified conditions
   * @param {Partial<Task>} condition - Filter conditions
   * @returns {Task[]} Array of filtered tasks
   */
  filter(condition: Partial<Task>): Task[] {
    return this.getAll().filter((v) =>
      Object.entries(condition).every(
        ([key, value]) => key in v && value === v[key as keyof typeof v]
      )
    );
  }

  /**
   * Add a new task
   * @param {Task} task - Task to add
   * @returns {Task[]} Updated array of tasks
   */
  add(task: Task): Task[] {
    const data = this.getAll();
    data.unshift(task);
    this.#store.setItem(this.#key, JSON.stringify(data));
    return data;
  }

  /**
   * Update an existing task
   * @param {Partial<Task> & { id: string }} task - Partial task data to update (id required)
   * @returns {Task[]} Updated array of tasks
   */
  update(task: Partial<Task> & { id: string }): Task[] {
    const data = this.getAll().map((v) =>
      v.id === task.id ? { ...v, ...task } : v
    );
    this.#store.setItem(this.#key, JSON.stringify(data));
    return data;
  }

  /**
   * Delete a task by ID
   * @param {string} id - ID of task to delete
   * @returns {Task[]} Updated array of tasks
   */
  delete(id: string): Task[] {
    const data = this.getAll().filter((v) => v.id !== id);
    this.#store.setItem(this.#key, JSON.stringify(data));
    return data;
  }
}
