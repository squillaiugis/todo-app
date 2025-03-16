import { TaskPriority } from "../types/todo";
import { createElement } from "../utils/dom";

/**
 * Class for managing task input form
 * @class
 */
export class TaskForm {
  private element: HTMLElement;
  private form: HTMLFormElement;
  private taskInput: HTMLInputElement;
  private prioritySelect: HTMLSelectElement;
  private onTaskAdd: (text: string, priority: TaskPriority) => void;

  /**
   * Create a new TaskForm instance
   * @param {function} onTaskAdd - Callback function for task addition
   */
  constructor(onTaskAdd: (text: string, priority: TaskPriority) => void) {
    this.onTaskAdd = onTaskAdd;

    // Create element
    this.element = createElement<HTMLElement>(
      "section",
      "input-section glass-panel"
    );

    // Heading
    const heading = createElement<HTMLHeadingElement>("h2");
    heading.textContent = "New Task";

    // Form
    this.form = createElement<HTMLFormElement>("form", "", { id: "todo-form" });

    // Task input field
    const taskInputGroup = createElement<HTMLDivElement>("div", "form-group");
    this.taskInput = createElement<HTMLInputElement>("input", "", {
      type: "text",
      id: "task-input",
      placeholder: "Enter your task",
      required: "required",
    });
    taskInputGroup.appendChild(this.taskInput);

    // Priority selection
    const priorityGroup = createElement<HTMLDivElement>(
      "div",
      "form-group priority-group"
    );
    const priorityLabel = createElement<HTMLLabelElement>("label", "", {
      for: "priority-select",
    });
    priorityLabel.textContent = "Priority";

    this.prioritySelect = createElement<HTMLSelectElement>("select", "", {
      id: "priority-select",
    });

    const priorities: {
      value: TaskPriority;
      label: string;
      selected?: boolean;
    }[] = [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium", selected: true },
      { value: "low", label: "Low" },
    ];

    priorities.forEach((priority) => {
      const option = createElement<HTMLOptionElement>("option", "", {
        value: priority.value,
      });
      option.textContent = priority.label;
      if (priority.selected) {
        option.selected = true;
      }
      this.prioritySelect.appendChild(option);
    });

    priorityGroup.appendChild(priorityLabel);
    priorityGroup.appendChild(this.prioritySelect);

    // Add button
    const addButton = createElement<HTMLButtonElement>("button", "btn-add", {
      type: "submit",
    });
    addButton.textContent = "Add";

    // Build form
    this.form.appendChild(taskInputGroup);
    this.form.appendChild(priorityGroup);
    this.form.appendChild(addButton);

    // Build elements
    this.element.appendChild(heading);
    this.element.appendChild(this.form);

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   * @private
   */
  private setupEventListeners(): void {
    // Form submission event
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const taskText = this.taskInput.value.trim();
      if (!taskText) return;

      const priority = this.prioritySelect.value as TaskPriority;

      // Fire task addition event
      this.onTaskAdd(taskText, priority);

      // Reset form
      this.taskInput.value = "";
      this.taskInput.focus();
    });
  }

  /**
   * Get form DOM element
   * @returns {HTMLElement} Form DOM element
   */
  public getElement(): HTMLElement {
    return this.element;
  }
}
