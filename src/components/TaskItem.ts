import { Task } from "../types/todo";
import { createElement } from "../utils/dom";

/**
 * 個々のタスク項目を管理するクラス
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
   * TaskItemのインスタンスを作成
   * @param {Task} task - タスクデータ
   * @param {function} onDelete - タスク削除時のコールバック関数
   * @param {function} onStatusChange - タスクの状態変更時のコールバック関数
   */
  constructor(
    task: Task,
    onDelete: (taskId: string) => void,
    onStatusChange: (taskId: string, completed: boolean) => void
  ) {
    this.task = task;
    this.onDelete = onDelete;
    this.onStatusChange = onStatusChange;

    // 要素の作成
    this.element = createElement<HTMLLIElement>("li", "task-item");
    this.element.dataset.priority = task.priority;
    if (task.completed) {
      this.element.classList.add("completed");
    }

    // チェックボックス
    this.checkbox = createElement<HTMLInputElement>("input", "task-checkbox", {
      type: "checkbox",
    });
    this.checkbox.checked = task.completed;

    // タスクテキスト
    this.taskText = createElement<HTMLSpanElement>(
      "span",
      "task-text ellipsis"
    );
    this.taskText.textContent = task.text;

    // 削除ボタン
    this.deleteBtn = createElement<HTMLButtonElement>("button", "btn-delete");
    this.deleteBtn.textContent = "削除";

    // 要素の構築
    const taskContent = createElement<HTMLDivElement>("div", "task-content");
    taskContent.appendChild(this.checkbox);
    taskContent.appendChild(this.taskText);

    const taskActions = createElement<HTMLDivElement>("div", "task-actions");
    taskActions.appendChild(this.deleteBtn);

    this.element.appendChild(taskContent);
    this.element.appendChild(taskActions);

    // イベントリスナーの設定
    this.setupEventListeners();
  }

  /**
   * イベントリスナーを設定
   * @private
   */
  private setupEventListeners(): void {
    // チェックボックスの変更イベント
    this.checkbox.addEventListener("change", () => {
      if (this.checkbox.checked) {
        this.element.classList.add("completed");
      } else {
        this.element.classList.remove("completed");
      }

      this.onStatusChange(this.task.id, this.checkbox.checked);
    });

    // 削除ボタンのクリックイベント
    this.deleteBtn.addEventListener("click", () => {
      // 削除アニメーション
      this.element.style.opacity = "0";
      this.element.style.transform = "translateY(-20px)";

      setTimeout(() => {
        this.onDelete(this.task.id);
      }, 300);
    });

    // タスクテキストのクリックイベント
    this.taskText.addEventListener("click", this.toggleTaskText.bind(this));
  }

  /**
   * タスクテキストの展開/折りたたみを切り替え
   * @private
   */
  private toggleTaskText(): void {
    // チェックボックスのクリックイベントが伝播しないようにする
    if (this.taskText.classList.contains("expanded")) {
      // 折りたたむ
      this.taskText.classList.remove("expanded");
      this.taskText.classList.add("ellipsis");
      this.element.style.alignItems = "center";
    } else {
      // 展開する
      this.taskText.classList.remove("ellipsis");
      this.taskText.classList.add("expanded");
      this.element.style.alignItems = "flex-start";
    }
  }

  /**
   * タスクテキストの省略状態を設定
   */
  public setupTaskText(): void {
    // テキストが省略されているかチェック
    const isEllipsisActive =
      this.taskText.offsetWidth < this.taskText.scrollWidth;

    // データ属性に省略状態を保存
    this.taskText.dataset.isEllipsis = String(isEllipsisActive);
  }

  /**
   * タスク項目のDOM要素を取得
   * @returns {HTMLLIElement} タスク項目のDOM要素
   */
  public getElement(): HTMLLIElement {
    return this.element;
  }

  /**
   * タスクのIDを取得
   * @returns {string} タスクのID
   */
  public getId(): string {
    return this.task.id;
  }

  /**
   * タスクの完了状態を取得
   * @returns {boolean} タスクが完了している場合はtrue
   */
  public isCompleted(): boolean {
    return this.task.completed;
  }

  /**
   * タスクの表示/非表示を設定
   * @param {string} display - CSSのdisplayプロパティ値
   */
  public setDisplay(display: string): void {
    this.element.style.display = display;
  }
}
