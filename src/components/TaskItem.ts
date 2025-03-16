import { Task } from "../types/todo";
import { createElement } from "../utils/dom";

/**
 * Class for managing individual task items
 * @class
 */
export class TaskItem {
  private element: HTMLLIElement;
  private checkbox: HTMLInputElement;
  private taskText: HTMLSpanElement;
  private deleteBtn: HTMLButtonElement;
  private task: Task;
  private onDelete: (taskId: string) => void;
  private onStatusChange: (taskId: string, completed: boolean) => void;

  /**
   * Create a new TaskItem instance
   * @param {Task} task - Task data
   * @param {function} onDelete - Callback function for task deletion
   * @param {function} onStatusChange - Callback function for task status changes
   */
  constructor(
    task: Task,
    onDelete: (taskId: string) => void,
    onStatusChange: (taskId: string, completed: boolean) => void
  ) {
    this.task = task;
    this.onDelete = onDelete;
    this.onStatusChange = onStatusChange;

    // Create element
    this.element = createElement<HTMLLIElement>("li", "task-item");
    this.element.dataset.priority = task.priority;
    if (task.completed) {
      this.element.classList.add("completed");
    }

    // Checkbox
    this.checkbox = createElement<HTMLInputElement>("input", "task-checkbox", {
      type: "checkbox",
    });
    this.checkbox.checked = task.completed;

    // Task text
    this.taskText = createElement<HTMLSpanElement>(
      "span",
      "task-text ellipsis"
    );
    this.taskText.textContent = task.text;

    // Delete button
    this.deleteBtn = createElement<HTMLButtonElement>("button", "btn-delete");
    this.deleteBtn.textContent = "Delete";

    // Build elements
    const taskContent = createElement<HTMLDivElement>("div", "task-content");
    taskContent.appendChild(this.checkbox);
    taskContent.appendChild(this.taskText);

    const taskActions = createElement<HTMLDivElement>("div", "task-actions");
    taskActions.appendChild(this.deleteBtn);

    this.element.appendChild(taskContent);
    this.element.appendChild(taskActions);

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   * @private
   */
  private setupEventListeners(): void {
    // Checkbox change event
    this.checkbox.addEventListener("change", () => {
      if (this.checkbox.checked) {
        this.element.classList.add("completed");
      } else {
        this.element.classList.remove("completed");
      }

      this.onStatusChange(this.task.id, this.checkbox.checked);
    });

    // Delete button click event
    this.deleteBtn.addEventListener("click", () => {
      // Delete animation
      this.element.style.opacity = "0";
      this.element.style.transform = "translateY(-20px)";

      setTimeout(() => {
        this.onDelete(this.task.id);
      }, 300);
    });

    // Task text click event
    this.taskText.addEventListener("click", this.toggleTaskText.bind(this));
  }

  /**
   * Toggle task text expansion/collapse
   * @private
   */
  private toggleTaskText(): void {
    // Prevent checkbox click event propagation
    if (this.taskText.classList.contains("expanded")) {
      // Collapse
      this.taskText.classList.remove("expanded");
      this.taskText.classList.add("ellipsis");
      this.element.style.alignItems = "center";
    } else {
      // Expand
      this.taskText.classList.remove("ellipsis");
      this.taskText.classList.add("expanded");
      this.element.style.alignItems = "flex-start";
    }
  }

  /**
   * Set up task text ellipsis state
   */
  public setupTaskText(): void {
    // Check if text is ellipsized
    const isEllipsisActive =
      this.taskText.offsetWidth < this.taskText.scrollWidth;

    // Save ellipsis state to data attribute
    this.taskText.dataset.isEllipsis = String(isEllipsisActive);
  }

  /**
   * Get task item DOM element
   * @returns {HTMLLIElement} Task item DOM element
   */
  public getElement(): HTMLLIElement {
    return this.element;
  }

  /**
   * Get task ID
   * @returns {string} Task ID
   */
  public getId(): string {
    return this.task.id;
  }

  /**
   * Get task completion status
   * @returns {boolean} True if task is completed
   */
  public isCompleted(): boolean {
    return this.task.completed;
  }

  /**
   * Set task display state
   * @param {string} display - CSS display property value
   */
  public setDisplay(display: string): void {
    this.element.style.display = display;
  }
}
