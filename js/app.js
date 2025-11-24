"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addButton = document.getElementById("addButton");
  const todoList = document.getElementById("todoList");
  const emptyState = document.getElementById("emptyState");

  const STORAGE_KEY = "sive_todo_items";
  let todos = [];

  // -------------------------
  // LocalStorage işlemleri
  // -------------------------
  function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          todos = parsed;
        }
      } catch (err) {
        console.error("LocalStorage okunamadı:", err);
      }
    }

    // İlk açılışta hiç veri yoksa örnek görevler
    if (!stored) {
      todos = [
        { text: "3 Litre Su İç", done: false },
        { text: "Ödevleri Yap", done: false },
        { text: "En Az 3 Saat Kodlama Yap", done: false },
        { text: "Yemek Yap", done: false },
        { text: "50 Sayfa Kitap Oku", done: false },
      ];
      saveToStorage();
    }

    renderList();
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // -------------------------
  // Toast helper fonksiyonları
  // -------------------------
  function showSuccessToast() {
    $("#toastSuccess").toast("show");
  }

  function showErrorToast() {
    $("#toastError").toast("show");
  }

  // -------------------------
  // Listeyi ekrana çiz
  // -------------------------
  function renderList() {
    todoList.innerHTML = "";

    if (todos.length === 0) {
      emptyState.style.display = "block";
      return;
    } else {
      emptyState.style.display = "none";
    }

    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      li.classList.add("todo-item");
      if (todo.done) {
        li.classList.add("completed");
      }
      li.dataset.index = index.toString();

      const checkBtn = document.createElement("button");
      checkBtn.classList.add("check-btn");
      const icon = document.createElement("span");
      icon.classList.add("check-icon");
      checkBtn.appendChild(icon);

      const textSpan = document.createElement("span");
      textSpan.classList.add("todo-text");
      textSpan.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.innerHTML = "&times;";

      li.appendChild(checkBtn);
      li.appendChild(textSpan);
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
  }

  function addTodo() {
    const value = taskInput.value.trim();

    if (!value) {
      showErrorToast();
      return;
    }

    todos.push({ text: value, done: false });
    taskInput.value = "";
    saveToStorage();
    renderList();
    showSuccessToast();
  }

  function toggleTodo(index) {
    const i = Number(index);
    if (Number.isNaN(i) || !todos[i]) return;

    todos[i].done = !todos[i].done;
    saveToStorage();
    renderList();
  }

  function deleteTodo(index) {
    const i = Number(index);
    if (Number.isNaN(i) || !todos[i]) return;

    todos.splice(i, 1);
    saveToStorage();
    renderList();
  }

  // -------------------------
  // Event listener’lar
  // -------------------------
  addButton.addEventListener("click", addTodo);

  taskInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addTodo();
    }
  });

  // Liste içinde tıklama (yapıldı / sil)
  todoList.addEventListener("click", function (event) {
    const li = event.target.closest("li.todo-item");
    if (!li) return;

    const index = li.dataset.index;

    if (event.target.closest(".delete-btn")) {
      deleteTodo(index);
    } else if (
      event.target.closest(".check-btn") ||
      event.target.classList.contains("todo-text")
    ) {
      toggleTodo(index);
    }
  });

  // Sayfa yüklendiğinde verileri çek
  loadFromStorage();
});
