/**
 * 指定されたセレクタに一致する要素を取得する
 * @param selector - CSSセレクタ
 * @returns 要素またはnull
 */
export function getElement<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

/**
 * 指定されたセレクタに一致するすべての要素を取得する
 * @param selector - CSSセレクタ
 * @returns 要素の配列
 */
export function getAllElements<T extends HTMLElement>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector));
}

/**
 * 新しい要素を作成する
 * @param tagName - 作成する要素のタグ名
 * @param className - 要素に追加するクラス名
 * @param attributes - 要素に設定する属性
 * @returns 作成された要素
 */
export function createElement<T extends HTMLElement>(
  tagName: string,
  className?: string,
  attributes?: Record<string, string>
): T {
  const element = document.createElement(tagName) as T;

  if (className) {
    element.className = className;
  }

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}
