import { Task, TaskPriority } from "./types/todo";
import { createElement } from "./utils/dom";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TodoStore } from "./store/TodoStore";

/**
 * Todoアプリケーションのメインクラス
 * @class
 * @description タスク管理アプリケーションの全体的な状態と操作を管理します
 */
export class TodoApp {
  private container: HTMLDivElement;
  private header: HTMLElement;
  private main: HTMLElement;
  private taskForm: TaskForm;
  private taskList: TaskList;
  private todoStore: TodoStore;

  /**
   * TodoAppのインスタンスを作成
   * @param {HTMLElement} rootElement - アプリケーションをマウントするDOM要素
   * @param {TodoStore} todoStore - タスクデータを管理するストアインスタンス
   */
  constructor(rootElement: HTMLElement, todoStore: TodoStore) {
    this.todoStore = todoStore;

    // コンテナの作成
    this.container = createElement<HTMLDivElement>("div", "container");

    // ヘッダーの作成
    this.header = createElement<HTMLElement>("header", "header");
    const logo = createElement<HTMLHeadingElement>("h1", "logo");
    logo.textContent = "Todo App";
    this.header.appendChild(logo);

    // メインコンテンツの作成
    this.main = createElement<HTMLElement>("main", "main");

    // タスク入力フォームの作成
    this.taskForm = new TaskForm(this.handleTaskAdd.bind(this));

    // タスクリストの作成
    this.taskList = new TaskList(
      this.handleTaskDelete.bind(this),
      this.handleTaskStatusChange.bind(this)
    );

    // 要素の構築
    this.main.appendChild(this.taskForm.getElement());
    this.main.appendChild(this.taskList.getElement());

    this.container.appendChild(this.header);
    this.container.appendChild(this.main);

    // ルート要素に追加
    rootElement.appendChild(this.container);

    // 初期タスクの設定
    this.loadInitialTasks();
  }

  /**
   * 初期タスクを読み込んでアプリケーションを初期化
   * @private
   * @description localStorageからタスクを読み込み、存在しない場合はサンプルタスクを設定します
   */
  private loadInitialTasks(): void {
    // localStorageからタスクを読み込む
    const tasks = this.todoStore.getAll();

    // タスクが存在しない場合のみ、サンプルタスクを設定
    if (tasks.length === 0) {
      const initialTasks: Task[] = [
        {
          id: "1",
          text: "プロジェクト計画書を作成する",
          priority: "high",
          completed: false,
        },
        {
          id: "2",
          text: "買い物リストを作る",
          priority: "medium",
          completed: false,
        },
        {
          id: "3",
          text: "メールを確認する",
          priority: "low",
          completed: true,
        },
      ];

      // サンプルタスクを保存
      initialTasks.forEach((task) => this.todoStore.add(task));
      this.taskList.setInitialTasks(initialTasks);
    } else {
      this.taskList.setInitialTasks(tasks);
    }
  }

  /**
   * 新しいタスクを追加するハンドラー
   * @private
   * @param {string} text - タスクの内容
   * @param {TaskPriority} priority - タスクの優先度
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
   * タスクを削除するハンドラー
   * @private
   * @param {string} taskId - 削除するタスクのID
   */
  private handleTaskDelete(taskId: string): void {
    console.log("Deleting task:", taskId);
    this.todoStore.delete(taskId);
    console.log("Remaining tasks:", this.todoStore.getAll());
    this.taskList.removeTask(taskId);
  }

  /**
   * タスクの状態を更新するハンドラー
   * @private
   * @param {string} taskId - 更新するタスクのID
   * @param {boolean} completed - タスクの新しい完了状態
   */
  private handleTaskStatusChange(taskId: string, completed: boolean): void {
    this.todoStore.update({ id: taskId, completed });
    this.taskList.updateTaskStatus(taskId, completed);
  }
}
