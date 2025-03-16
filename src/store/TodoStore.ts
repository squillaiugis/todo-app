import { Task } from "../types/todo";

/**
 * TodoStoreクラス - タスクのローカルストレージ管理を担当
 * @class
 */
export class TodoStore {
  #store: Storage;
  #key: string = "tasks";

  /**
   * TodoStoreのインスタンスを作成
   * @param {Storage} store - ストレージインスタンス（通常はlocalStorage）
   */
  constructor(store: Storage) {
    this.#store = store;
  }

  /**
   * データがTaskインターフェースに準拠しているか検証
   * @private
   * @param {unknown} data - 検証対象のデータ
   * @returns {boolean} データが有効な場合はtrue、そうでない場合はfalse
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
   * 保存されているすべてのタスクを取得
   * @returns {Task[]} タスクの配列
   * @throws {Error} データ形式が無効な場合
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
   * 指定された条件に一致するタスクをフィルタリング
   * @param {Partial<Task>} condition - フィルタリング条件
   * @returns {Task[]} フィルタリングされたタスクの配列
   */
  filter(condition: Partial<Task>): Task[] {
    return this.getAll().filter((v) =>
      Object.entries(condition).every(
        ([key, value]) => key in v && value === v[key as keyof typeof v]
      )
    );
  }

  /**
   * 新しいタスクを追加
   * @param {Task} task - 追加するタスク
   * @returns {Task[]} 更新後のタスク配列
   */
  add(task: Task): Task[] {
    const data = this.getAll();
    data.unshift(task);
    this.#store.setItem(this.#key, JSON.stringify(data));
    return data;
  }

  /**
   * 既存のタスクを更新
   * @param {Partial<Task> & { id: string }} task - 更新するタスクの部分データ（idは必須）
   * @returns {Task[]} 更新後のタスク配列
   */
  update(task: Partial<Task> & { id: string }): Task[] {
    const data = this.getAll().map((v) =>
      v.id === task.id ? { ...v, ...task } : v
    );
    this.#store.setItem(this.#key, JSON.stringify(data));
    return data;
  }

  /**
   * 指定されたIDのタスクを削除
   * @param {string} id - 削除するタスクのID
   * @returns {Task[]} 更新後のタスク配列
   */
  delete(id: string): Task[] {
    const data = this.getAll().filter((v) => v.id !== id);
    this.#store.setItem(this.#key, JSON.stringify(data));
    return data;
  }
}
