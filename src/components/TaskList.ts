import { Task, TaskFilter } from "../types/todo";
import { createElement } from "../utils/dom";
import { TaskItem } from "./TaskItem";
import { Pagination } from "./Pagination";

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

  constructor(
    onTaskDelete: (taskId: string) => void,
    onTaskStatusChange: (taskId: string, completed: boolean) => void
  ) {
    this.tasks = [];
    this.currentFilter = "all";
    this.tasksPerPage = 10;
    this.onTaskDelete = onTaskDelete;
    this.onTaskStatusChange = onTaskStatusChange;

    // 要素の作成
    this.element = createElement<HTMLElement>(
      "section",
      "tasks-section glass-panel"
    );

    // タブの作成
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

    this.tabButtons[0].textContent = "すべて";
    this.tabButtons[1].textContent = "未完了";
    this.tabButtons[2].textContent = "完了";

    this.tabButtons.forEach((button) => tabs.appendChild(button));

    // タスクコンテナの作成
    this.tasksContainer = createElement<HTMLDivElement>(
      "div",
      "tasks-container"
    );
    this.tasksList = createElement<HTMLUListElement>("ul", "", {
      id: "tasks-list",
    });
    this.tasksContainer.appendChild(this.tasksList);

    // ページネーションの作成
    this.pagination = new Pagination(this.handlePageChange.bind(this));

    // 要素の構築
    this.element.appendChild(tabs);
    this.element.appendChild(this.tasksContainer);
    this.element.appendChild(this.pagination.getElement());

    // イベントリスナーの設定
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // タブボタンのクリックイベント
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // アクティブなタブを更新
        this.tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // フィルターを適用
        const filter = button.dataset.tab as TaskFilter;
        this.currentFilter = filter;
        this.applyFilterAndPagination();
      });
    });

    // ウィンドウリサイズ時にタスクテキストの状態を更新
    window.addEventListener("resize", this.setupTaskTexts.bind(this));
  }

  private handlePageChange(): void {
    this.applyFilterAndPagination();
  }

  /**
   * タスクを追加する
   */
  public addTask(task: Task): void {
    const taskItem = new TaskItem(
      task,
      this.onTaskDelete,
      this.onTaskStatusChange
    );

    // タスクリストの先頭に追加
    this.tasks.unshift(taskItem);
    this.tasksList.prepend(taskItem.getElement());

    // アニメーション効果
    setTimeout(() => {
      taskItem.getElement().style.opacity = "1";
      taskItem.getElement().style.transform = "translateY(0)";
    }, 10);

    // フィルターとページネーションを適用
    this.applyFilterAndPagination();

    // タスクテキストの状態を設定
    setTimeout(this.setupTaskTexts.bind(this), 100);
  }

  /**
   * タスクを削除する
   */
  public removeTask(taskId: string): void {
    const index = this.tasks.findIndex((task) => task.getId() === taskId);

    if (index !== -1) {
      // DOM要素を削除
      const taskElement = this.tasks[index].getElement();
      taskElement.remove();

      // tasksの配列から削除
      this.tasks.splice(index, 1);
      this.applyFilterAndPagination();
    }
  }

  /**
   * タスクの状態を変更する
   */
  public updateTaskStatus(taskId: string, completed: boolean): void {
    const taskItem = this.tasks.find((task) => task.getId() === taskId);

    if (taskItem) {
      if (completed) {
        // 完了したタスクを一番下に移動
        this.tasks = this.tasks.filter((task) => task.getId() !== taskId);
        this.tasks.push(taskItem);
      } else {
        // 未完了のタスクを一番上に移動
        this.tasks = this.tasks.filter((task) => task.getId() !== taskId);
        this.tasks.unshift(taskItem);
      }

      // DOMの順序を更新
      this.tasksList.innerHTML = "";
      this.tasks.forEach((task) => {
        this.tasksList.appendChild(task.getElement());
      });

      this.applyFilterAndPagination();
    }
  }

  /**
   * フィルターを適用する
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

      // 表示状態を設定
      task.setDisplay("none"); // 一旦すべて非表示

      if (isVisible) {
        visibleTasks.push(task);
      }
    });

    return visibleTasks;
  }

  /**
   * ページネーションを適用する
   */
  private applyPagination(visibleTasks: TaskItem[]): void {
    const currentPage = this.pagination.getCurrentPage();

    // 表示するタスクの範囲を計算
    const startIndex = (currentPage - 1) * this.tasksPerPage;
    const endIndex = startIndex + this.tasksPerPage;

    // 表示範囲内のタスクのみ表示
    visibleTasks.forEach((task, index) => {
      if (index >= startIndex && index < endIndex) {
        task.setDisplay("flex");
      } else {
        task.setDisplay("none");
      }
    });

    // 表示状態が変わったのでタスクテキストの状態を更新
    setTimeout(this.setupTaskTexts.bind(this), 50);
  }

  /**
   * フィルターとページネーションを適用する
   */
  private applyFilterAndPagination(): void {
    const visibleTasks = this.applyFilter();

    // ページネーションの更新
    this.pagination.updateTotalPages(visibleTasks.length, this.tasksPerPage);

    // ページネーションの適用
    this.applyPagination(visibleTasks);
  }

  /**
   * タスクテキストの省略状態を設定する
   */
  private setupTaskTexts(): void {
    this.tasks.forEach((task) => {
      task.setupTaskText();
    });
  }

  /**
   * タスクリスト要素を取得する
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * 初期タスクを設定する
   */
  public setInitialTasks(tasks: Task[]): void {
    this.tasks = tasks.map((task) => {
      return new TaskItem(task, this.onTaskDelete, this.onTaskStatusChange);
    });

    // DOMに追加
    this.tasksList.innerHTML = "";
    this.tasks.forEach((task) => {
      this.tasksList.appendChild(task.getElement());
    });

    // フィルターとページネーションを適用
    this.applyFilterAndPagination();

    // タスクテキストの状態を設定
    setTimeout(this.setupTaskTexts.bind(this), 100);
  }
}
