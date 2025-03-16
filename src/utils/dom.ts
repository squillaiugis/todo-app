/**
 * Get element matching the specified selector
 * @param selector - CSS selector
 * @returns Element or null
 */
export function getElement<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

/**
 * Get all elements matching the specified selector
 * @param selector - CSS selector
 * @returns Array of elements
 */
export function getAllElements<T extends HTMLElement>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector));
}

/**
 * Create a new element
 * @param tagName - Tag name of element to create
 * @param className - Class name to add to element
 * @param attributes - Attributes to set on element
 * @returns Created element
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
