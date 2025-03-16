import { Task, TaskFilter } from "../types/todo";
import { createElement } from "../utils/dom";
import { TaskItem } from "./TaskItem";
import { Pagination } from "./Pagination";

/**
 * Class for managing task list
 * @class
 */
export class TaskList {
  private element: HTMLElement;
  private tasksContainer: HTMLDivElement;
  private tasksList: HTMLUListElement;
  private tabButtons: HTMLButtonElement[];
  private pagination: Pagination;
  private tasks: TaskItem[];
  private currentFilter: TaskFilter;
  private tasksPerPage: number;
  private onTaskDelete: (taskId: string) => void;
  private onTaskStatusChange: (taskId: string, completed: boolean) => void;

  /**
   * Create a new TaskList instance
   * @param {function} onTaskDelete - Callback function for task deletion
   * @param {function} onTaskStatusChange - Callback function for task status changes
   */
  constructor(
    onTaskDelete: (taskId: string) => void,
    onTaskStatusChange: (taskId: string, completed: boolean) => void
  ) {
    this.tasks = [];
    this.currentFilter = "all";
    this.tasksPerPage = 10;
    this.onTaskDelete = onTaskDelete;
    this.onTaskStatusChange = onTaskStatusChange;

    // Create element
    this.element = createElement<HTMLElement>(
      "section",
      "tasks-section glass-panel"
    );

    // Create tabs
    const tabs = createElement<HTMLDivElement>("div", "tabs");

    this.tabButtons = [
      createElement<HTMLButtonElement>("button", "tab-btn active", {
        "data-tab": "all",
      }),
      createElement<HTMLButtonElement>("button", "tab-btn", {
        "data-tab": "active",
      }),
      createElement<HTMLButtonElement>("button", "tab-btn", {
        "data-tab": "completed",
      }),
    ];

    this.tabButtons[0].textContent = "All";
    this.tabButtons[1].textContent = "Active";
    this.tabButtons[2].textContent = "Completed";

    this.tabButtons.forEach((button) => tabs.appendChild(button));

    // Create task container
    this.tasksContainer = createElement<HTMLDivElement>(
      "div",
      "tasks-container"
    );
    this.tasksList = createElement<HTMLUListElement>("ul", "", {
      id: "tasks-list",
    });
    this.tasksContainer.appendChild(this.tasksList);

    // Create pagination
    this.pagination = new Pagination(this.handlePageChange.bind(this));

    // Build elements
    this.element.appendChild(tabs);
    this.element.appendChild(this.tasksContainer);
    this.element.appendChild(this.pagination.getElement());

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   * @private
   */
  private setupEventListeners(): void {
    // Tab button click event
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active tab
        this.tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Apply filter
        const filter = button.dataset.tab as TaskFilter;
        this.currentFilter = filter;
        this.applyFilterAndPagination();
      });
    });

    // Update task text states on window resize
    window.addEventListener("resize", this.setupTaskTexts.bind(this));
  }

  /**
   * Handle page change events
   * @private
   */
  private handlePageChange(): void {
    this.applyFilterAndPagination();
  }

  /**
   * Add a new task
   * @param {Task} task - Task data to add
   */
  public addTask(task: Task): void {
    const taskItem = new TaskItem(
      task,
      this.onTaskDelete,
      this.onTaskStatusChange
    );

    // Add to the beginning of task list
    this.tasks.unshift(taskItem);
    this.tasksList.prepend(taskItem.getElement());

    // Animation effect
    setTimeout(() => {
      taskItem.getElement().style.opacity = "1";
      taskItem.getElement().style.transform = "translateY(0)";
    }, 10);

    // Apply filter and pagination
    this.applyFilterAndPagination();

    // Set up task text state
    setTimeout(this.setupTaskTexts.bind(this), 100);
  }

  /**
   * Remove a task
   * @param {string} taskId - ID of task to remove
   */
  public removeTask(taskId: string): void {
    const index = this.tasks.findIndex((task) => task.getId() === taskId);

    if (index !== -1) {
      // Remove DOM element
      const taskElement = this.tasks[index].getElement();
      taskElement.remove();

      // Remove from tasks array
      this.tasks.splice(index, 1);
      this.applyFilterAndPagination();
    }
  }

  /**
   * Update task status
   * @param {string} taskId - ID of task to update
   * @param {boolean} completed - Task completion status
   */
  public updateTaskStatus(taskId: string, completed: boolean): void {
    const taskItem = this.tasks.find((task) => task.getId() === taskId);

    if (taskItem) {
      if (completed) {
        // Move completed task to the bottom
        this.tasks = this.tasks.filter((task) => task.getId() !== taskId);
        this.tasks.push(taskItem);
      } else {
        // Move active task to the top
        this.tasks = this.tasks.filter((task) => task.getId() !== taskId);
        this.tasks.unshift(taskItem);
      }

      // Update DOM order
      this.tasksList.innerHTML = "";
      this.tasks.forEach((task) => {
        this.tasksList.appendChild(task.getElement());
      });

      this.applyFilterAndPagination();
    }
  }

  /**
   * Apply filter to tasks
   * @private
   * @returns {TaskItem[]} Filtered task array
   */
  private applyFilter(): TaskItem[] {
    const visibleTasks: TaskItem[] = [];

    this.tasks.forEach((task) => {
      let isVisible = false;

      switch (this.currentFilter) {
        case "active":
          isVisible = !task.isCompleted();
          break;
        case "completed":
          isVisible = task.isCompleted();
          break;
        default: // 'all'
          isVisible = true;
      }

      // Set display state
      task.setDisplay("none"); // Hide all initially

      if (isVisible) {
        visibleTasks.push(task);
      }
    });

    return visibleTasks;
  }

  /**
   * Apply pagination
   * @private
   * @param {TaskItem[]} visibleTasks - Array of visible tasks
   */
  private applyPagination(visibleTasks: TaskItem[]): void {
    const currentPage = this.pagination.getCurrentPage();

    // Calculate task range to display
    const startIndex = (currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;

    // Show only tasks within range
    visibleTasks.forEach((task, index) => {
      if (index >= startIndex && index < endIndex) {
        task.setDisplay("flex");
      } else {
        task.setDisplay("none");
      }
    });

    // Update task text states after display changes
    setTimeout(this.setupTaskTexts.bind(this), 50);
  }

  /**
   * Apply filter and pagination
   * @private
   */
  private applyFilterAndPagination(): void {
    const visibleTasks = this.applyFilter();

    // ページネーションの更新
    this.pagination.updateTotalPages(visibleTasks.length, this.tasksPerPage);

    // ページネーションの適用
    this.applyPagination(visibleTasks);
  }

  /**
   * Set up task text ellipsis states
   * @private
   */
  private setupTaskTexts(): void {
    this.tasks.forEach((task) => {
      task.setupTaskText();
    });
  }

  /**
   * Get task list DOM element
   * @returns {HTMLElement} Task list DOM element
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Set initial tasks
   * @param {Task[]} tasks - Array of initial tasks
   */
  public setInitialTasks(tasks: Task[]): void {
    this.tasks = tasks.map((task) => {
      return new TaskItem(task, this.onTaskDelete, this.onTaskStatusChange);
    });

    // Add to DOM
    this.tasksList.innerHTML = "";
    this.tasks.forEach((task) => {
      this.tasksList.appendChild(task.getElement());
    });

    // Apply filter and pagination
    this.applyFilterAndPagination();

    // Set up task text states
    setTimeout(this.setupTaskTexts.bind(this), 100);
  }
}
