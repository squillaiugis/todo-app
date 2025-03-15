import { createElement } from "../utils/dom";

export class Pagination {
  private element: HTMLDivElement;
  private prevBtn: HTMLButtonElement;
  private nextBtn: HTMLButtonElement;
  private pageNumbers: HTMLDivElement;
  private currentPage: number;
  private totalPages: number;
  private onPageChange: (page: number) => void;

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
   * 現在のページを設定する
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
   * 総ページ数を更新する
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
   * ページネーション要素を取得する
   */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * 現在のページを取得する
   */
  public getCurrentPage(): number {
    return this.currentPage;
  }
}
