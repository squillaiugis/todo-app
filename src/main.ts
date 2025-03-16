import "./style.css";
import { TodoApp } from "./TodoApp";
import { TodoStore } from "./store/TodoStore";

// Load fonts
const fontLink1 = document.createElement("link");
fontLink1.rel = "preconnect";
fontLink1.href = "https://fonts.googleapis.com";
document.head.appendChild(fontLink1);

const fontLink2 = document.createElement("link");
fontLink2.rel = "preconnect";
fontLink2.href = "https://fonts.gstatic.com";
fontLink2.crossOrigin = "anonymous";
document.head.appendChild(fontLink2);

const fontLink3 = document.createElement("link");
fontLink3.rel = "stylesheet";
fontLink3.href =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap";
document.head.appendChild(fontLink3);

// Set title
document.title = "Todo App";

// Initialize app
const appElement = document.querySelector<HTMLDivElement>("#app");

if (appElement) {
  const todoStore = new TodoStore(localStorage);
  new TodoApp(appElement, todoStore);
} else {
  console.error("App root element not found.");
}
