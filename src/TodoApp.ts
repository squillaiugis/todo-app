import { Task, TaskPriority } from "./types/todo";
import { createElement } from "./utils/dom";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TodoStore } from "./store/TodoStore";

/**
 * Main class for Todo application
 * @class
 * @description Manages overall state and operations of the task management application
 */
export class TodoApp {
  private container: HTMLDivElement;
  private header: HTMLElement;
  private main: HTMLElement;
  private taskForm: TaskForm;
  private taskList: TaskList;
  private todoStore: TodoStore;

  /**
   * Create a new TodoApp instance
   * @param {HTMLElement} rootElement - DOM element to mount the application
   * @param {TodoStore} todoStore - Store instance for managing task data
   */
  constructor(rootElement: HTMLElement, todoStore: TodoStore) {
    this.todoStore = todoStore;

    // Create container
    this.container = createElement<HTMLDivElement>("div", "container");

    // Create header
    this.header = createElement<HTMLElement>("header", "header");
    const logo = createElement<HTMLHeadingElement>("h1", "logo");
    logo.textContent = "Todo App";
    this.header.appendChild(logo);

    // Create main content
    this.main = createElement<HTMLElement>("main", "main");

    // Create task input form
    this.taskForm = new TaskForm(this.handleTaskAdd.bind(this));

    // Create task list
    this.taskList = new TaskList(
      this.handleTaskDelete.bind(this),
      this.handleTaskStatusChange.bind(this)
    );

    // Build elements
    this.main.appendChild(this.taskForm.getElement());
    this.main.appendChild(this.taskList.getElement());

    this.container.appendChild(this.header);
    this.container.appendChild(this.main);

    // Add to root element
    rootElement.appendChild(this.container);

    // Set initial tasks
    this.loadInitialTasks();
  }

  /**
   * Load initial tasks and initialize application
   * @private
   * @description Loads tasks from localStorage, sets sample tasks if none exist
   */
  private loadInitialTasks(): void {
    // Load tasks from localStorage
    const tasks = this.todoStore.getAll();

    // Set sample tasks only if no tasks exist
    if (tasks.length === 0) {
      const initialTasks: Task[] = [
        {
          id: "1",
          text: "Create project plan",
          priority: "high",
          completed: false,
        },
        {
          id: "2",
          text: "Make shopping list",
          priority: "medium",
          completed: false,
        },
        {
          id: "3",
          text: "Check emails",
          priority: "low",
          completed: true,
        },
      ];

      // Save sample tasks
      initialTasks.forEach((task) => this.todoStore.add(task));
      this.taskList.setInitialTasks(initialTasks);
    } else {
      this.taskList.setInitialTasks(tasks);
    }
  }

  /**
   * Handler for adding new tasks
   * @private
   * @param {string} text - Task content
   * @param {TaskPriority} priority - Task priority
   */
  private handleTaskAdd(text: string, priority: TaskPriority): void {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      priority,
      completed: false,
    };

    this.todoStore.add(newTask);
    this.taskList.addTask(newTask);
  }

  /**
   * Handler for deleting tasks
   * @private
   * @param {string} taskId - ID of task to delete
   */
  private handleTaskDelete(taskId: string): void {
    console.log("Deleting task:", taskId);
    this.todoStore.delete(taskId);
    console.log("Remaining tasks:", this.todoStore.getAll());
    this.taskList.removeTask(taskId);
  }

  /**
   * Handler for updating task status
   * @private
   * @param {string} taskId - ID of task to update
   * @param {boolean} completed - New completion status of task
   */
  private handleTaskStatusChange(taskId: string, completed: boolean): void {
    this.todoStore.update({ id: taskId, completed });
    this.taskList.updateTaskStatus(taskId, completed);
  }
}
