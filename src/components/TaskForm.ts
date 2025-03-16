import { TaskPriority } from "../types/todo";
import { createElement } from "../utils/dom";

/**
 * タスク入力フォームを管理するクラス
 * @class
 */
export class TaskForm {
  private element: HTMLElement;
  private form: HTMLFormElement;
  private taskInput: HTMLInputElement;
  private prioritySelect: HTMLSelectElement;
  private onTaskAdd: (text: string, priority: TaskPriority) => void;

  /**
   * TaskFormのインスタンスを作成
   * @param {function} onTaskAdd - タスク追加時のコールバック関数
   */
  constructor(onTaskAdd: (text: string, priority: TaskPriority) => void) {
    this.onTaskAdd = onTaskAdd;

    // 要素の作成
    this.element = createElement<HTMLElement>(
      "section",
      "input-section glass-panel"
    );

    // 見出し
    const heading = createElement<HTMLHeadingElement>("h2");
    heading.textContent = "新しいタスク";

    // フォーム
    this.form = createElement<HTMLFormElement>("form", "", { id: "todo-form" });

    // タスク入力フィールド
    const taskInputGroup = createElement<HTMLDivElement>("div", "form-group");
    this.taskInput = createElement<HTMLInputElement>("input", "", {
      type: "text",
      id: "task-input",
      placeholder: "タスクを入力してください",
      required: "required",
    });
    taskInputGroup.appendChild(this.taskInput);

    // 優先度選択
    const priorityGroup = createElement<HTMLDivElement>(
      "div",
      "form-group priority-group"
    );
    const priorityLabel = createElement<HTMLLabelElement>("label", "", {
      for: "priority-select",
    });
    priorityLabel.textContent = "優先度";

    this.prioritySelect = createElement<HTMLSelectElement>("select", "", {
      id: "priority-select",
    });

    const priorities: {
      value: TaskPriority;
      label: string;
      selected?: boolean;
    }[] = [
      { value: "high", label: "高" },
      { value: "medium", label: "中", selected: true },
      { value: "low", label: "低" },
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

    // 追加ボタン
    const addButton = createElement<HTMLButtonElement>("button", "btn-add", {
      type: "submit",
    });
    addButton.textContent = "追加";

    // フォームの構築
    this.form.appendChild(taskInputGroup);
    this.form.appendChild(priorityGroup);
    this.form.appendChild(addButton);

    // 要素の構築
    this.element.appendChild(heading);
    this.element.appendChild(this.form);

    // イベントリスナーの設定
    this.setupEventListeners();
  }

  /**
   * イベントリスナーを設定
   * @private
   */
  private setupEventListeners(): void {
    // フォーム送信イベント
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const taskText = this.taskInput.value.trim();
      if (!taskText) return;

      const priority = this.prioritySelect.value as TaskPriority;

      // タスク追加イベントを発火
      this.onTaskAdd(taskText, priority);

      // フォームをリセット
      this.taskInput.value = "";
      this.taskInput.focus();
    });
  }

  /**
   * フォームのDOM要素を取得
   * @returns {HTMLElement} フォームのDOM要素
   */
  public getElement(): HTMLElement {
    return this.element;
  }
}
