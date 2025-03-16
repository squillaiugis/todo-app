import { createElement } from "../utils/dom";

/**
 * Class for managing pagination
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
   * Create a new Pagination instance
   * @param {function} onPageChange - Callback function for page change events
   */
  constructor(onPageChange: (page: number) => void) {
    this.currentPage = 1;
    this.totalPages = 1;
    this.onPageChange = onPageChange;

    // Create element
    this.element = createElement<HTMLDivElement>("div", "pagination");

    // Previous button
    this.prevBtn = createElement<HTMLButtonElement>(
      "button",
      "pagination-btn",
      { id: "prev-page" }
    );
    this.prevBtn.textContent = "Previous";
    this.prevBtn.disabled = true;

    // Page numbers container
    this.pageNumbers = createElement<HTMLDivElement>("div", "", {
      id: "page-numbers",
    });

    // Next button
    this.nextBtn = createElement<HTMLButtonElement>(
      "button",
      "pagination-btn",
      { id: "next-page" }
    );
    this.nextBtn.textContent = "Next";
    this.nextBtn.disabled = true;

    // Build elements
    this.element.appendChild(this.prevBtn);
    this.element.appendChild(this.pageNumbers);
    this.element.appendChild(this.nextBtn);

    // Set up event listeners
    this.setupEventListeners();

    // Set initial page
    this.updatePageNumbers();
  }

  /**
   * Set up event listeners
   * @private
   */
  private setupEventListeners(): void {
    // Previous button click event
    this.prevBtn.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
      }
    });

    // Next button click event
    this.nextBtn.addEventListener("click", () => {
      if (this.currentPage < this.totalPages) {
        this.setPage(this.currentPage + 1);
      }
    });
  }

  /**
   * Update page number display
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

    // Update previous and next button states
    this.prevBtn.disabled = this.currentPage <= 1;
    this.nextBtn.disabled = this.currentPage >= this.totalPages;
  }

  /**
   * Move to specified page
   * @param {number} page - Target page number
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
   * Update total number of pages
   * @param {number} totalItems - Total number of items
   * @param {number} itemsPerPage - Number of items per page
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
   * Get pagination element
   * @returns {HTMLDivElement} Pagination DOM element
   */
  public getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Get current page number
   * @returns {number} Current page number
   */
  public getCurrentPage(): number {
    return this.currentPage;
  }
}
