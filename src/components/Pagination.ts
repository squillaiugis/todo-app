import { createElement } from "../utils/dom";

/**
 * ページネーションを管理するクラス
 * @class
 */
export class Pagination {
  private element: HTMLDivElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private pageNumbers: HTMLDivElement;
  private currentPage: number;
  private totalPages: number;
  private onPageChange: (page: number) => void;

  /**
   * Paginationのインスタンスを作成
   * @param {function} onPageChange - ページ変更時のコールバック関数
   */
  constructor(onPageChange: (page: number) => void) {
    this.currentPage = 1;
    this.totalPages = 1;
    this.onPageChange = onPageChange;

    // 要素の作成
    this.element = createElement<HTMLDivElement>("div", "pagination");

    // 前へボタン
    this.prevBtn = createElement<HTMLButtonElement>(
      "button",
      "pagination-btn",
      { id: "prev-page" }
    );
    this.prevBtn.textContent = "前へ";
    this.prevBtn.disabled = true;

    // ページ番号コンテナ
    this.pageNumbers = createElement<HTMLDivElement>("div", "", {
      id: "page-numbers",
    });

    // 次へボタン
    this.nextBtn = createElement<HTMLButtonElement>(
      "button",
      "pagination-btn",
      { id: "next-page" }
    );
    this.nextBtn.textContent = "次へ";
    this.nextBtn.disabled = true;

    // 要素の構築
    this.element.appendChild(this.prevBtn);
    this.element.appendChild(this.pageNumbers);
    this.element.appendChild(this.nextBtn);

    // イベントリスナーの設定
    this.setupEventListeners();

    // 初期ページの設定
    this.updatePageNumbers();
  }

  /**
   * イベントリスナーを設定
   * @private
   */
  private setupEventListeners(): void {
    // 前へボタンのクリックイベント
    this.prevBtn.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
      }
    });

    // 次へボタンのクリックイベント
    this.nextBtn.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.currentPage + 1);
      }
    });
  }

  /**
   * ページ番号の表示を更新
   * @private
   */
  private updatePageNumbers(): void {
    this.pageNumbers.innerHTML = "";

    for (let i = 1; i <= this.totalPages; i++) {
      const pageBtn = createElement<HTMLButtonElement>(
        "button",
        `pagination-btn ${i === this.currentPage ? "active" : ""}`
      );
      pageBtn.textContent = String(i);
      pageBtn.dataset.page = String(i);

      pageBtn.addEventListener("click", () => {
        this.setPage(i);
      });

      this.pageNumbers.appendChild(pageBtn);
    }

    // 前へ・次へボタンの状態を更新
    this.prevBtn.disabled = this.currentPage <= 1;
    this.nextBtn.disabled = this.currentPage >= this.totalPages;
  }

  /**
   * 指定したページに移動
   * @param {number} page - 移動先のページ番号
   */
  public setPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.updatePageNumbers();
    this.onPageChange(page);
  }

  /**
   * 総ページ数を更新
   * @param {number} totalItems - アイテムの総数
   * @param {number} itemsPerPage - 1ページあたりのアイテム数
   */
  public updateTotalPages(totalItems: number, itemsPerPage: number): void {
    const newTotalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (this.totalPages !== newTotalPages) {
      this.totalPages = newTotalPages;
      this.currentPage = Math.min(this.currentPage, this.totalPages);
      this.updatePageNumbers();
    }
  }

  /**
   * ページネーション要素を取得
   * @returns {HTMLDivElement} ページネーションのDOM要素
   */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * 現在のページ番号を取得
   * @returns {number} 現在のページ番号
   */
  public getCurrentPage(): number {
    return this.currentPage;
  }
}
