document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const tasksList = document.getElementById('tasks-list');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    // 現在のフィルター状態とページ
    let currentFilter = 'all';
    let currentPage = 1;
    const tasksPerPage = 10;
    
    // タスクテキストの省略状態を設定する関数
    function setupTaskTexts() {
        const taskTexts = document.querySelectorAll('.task-text');
        
        taskTexts.forEach(taskText => {
            // 初期状態では省略表示クラスを追加
            if (!taskText.classList.contains('ellipsis') && !taskText.classList.contains('expanded')) {
                taskText.classList.add('ellipsis');
            }
            
            // テキストが省略されているかチェック
            const isEllipsisActive = taskText.offsetWidth < taskText.scrollWidth;
            
            // データ属性に省略状態を保存
            taskText.dataset.isEllipsis = isEllipsisActive;
            
            // クリックイベントが設定されていない場合のみ追加
            if (!taskText.hasClickListener) {
                taskText.addEventListener('click', toggleTaskText);
                taskText.hasClickListener = true;
            }
        });
    }
    
    // タスクテキストの展開/折りたたみを切り替える関数
    function toggleTaskText(e) {
        const taskText = e.currentTarget;
        
        // チェックボックスのクリックイベントが伝播しないようにする
        if (e.target.classList.contains('task-checkbox')) {
            return;
        }
        
        // 省略されていない場合は何もしない
        if (taskText.dataset.isEllipsis !== 'true' && taskText.classList.contains('ellipsis')) {
            return;
        }
        
        // 展開/折りたたみを切り替え
        if (taskText.classList.contains('expanded')) {
            // 折りたたむ
            taskText.classList.remove('expanded');
            taskText.classList.add('ellipsis');
        } else {
            // 展開する
            taskText.classList.remove('ellipsis');
            taskText.classList.add('expanded');
        }
        
        // タスク項目のレイアウトを調整
        const taskItem = taskText.closest('.task-item');
        if (taskText.classList.contains('expanded')) {
            taskItem.style.alignItems = 'flex-start';
        } else {
            taskItem.style.alignItems = 'center';
        }
    }
    
    // ウィンドウリサイズ時にタスクテキストの状態を更新
    window.addEventListener('resize', setupTaskTexts);
    
    // フォーム送信イベント
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskText = taskInput.value.trim();
        if (!taskText) return;
        
        const priority = prioritySelect.value;
        
        // 新しいタスクを追加
        addTask(taskText, priority);
        
        // フォームをリセット
        taskInput.value = '';
        taskInput.focus();
    });
    
    // タスク追加関数
    function addTask(text, priority) {
        // 新しいタスク要素を作成
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.dataset.priority = priority;
        taskItem.style.opacity = '0';
        
        taskItem.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox">
                <span class="task-text ellipsis">${text}</span>
            </div>
            <div class="task-actions">
                <button class="btn-delete">削除</button>
            </div>
        `;
        
        // タスクリストに追加
        tasksList.prepend(taskItem);
        
        // アニメーション効果
        setTimeout(() => {
            taskItem.style.opacity = '1';
            taskItem.style.transform = 'translateY(0)';
        }, 10);
        
        // チェックボックスのイベントリスナー
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                taskItem.classList.add('completed');
                
                // チェックマークアニメーション
                checkbox.style.animation = 'checkmark 0.3s ease forwards';
                
                // タスクを一番下に移動
                tasksList.appendChild(taskItem);
            } else {
                taskItem.classList.remove('completed');
                checkbox.style.animation = '';
                
                // タスクを一番上に移動
                tasksList.prepend(taskItem);
            }
            
            // フィルターとページネーションを適用
            applyFilterAndPagination();
        });
        
        // 削除ボタンのイベントリスナー
        const deleteBtn = taskItem.querySelector('.btn-delete');
        deleteBtn.addEventListener('click', () => {
            // 削除アニメーション
            taskItem.style.opacity = '0';
            taskItem.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                taskItem.remove();
                // ページネーションを更新
                updatePagination();
            }, 300);
        });
        
        // フィルターとページネーションを適用
        applyFilterAndPagination();
        
        // 新しく追加されたタスクのテキスト状態を設定
        setTimeout(setupTaskTexts, 100); // DOMが更新された後に実行
    }
    
    // タブ切り替えイベント
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // アクティブなタブを更新
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // フィルターを適用
            const filter = button.dataset.tab;
            currentFilter = filter;
            currentPage = 1; // フィルター変更時は1ページ目に戻る
            applyFilterAndPagination();
        });
    });
    
    // フィルター適用関数
    function applyFilter() {
        const tasks = tasksList.querySelectorAll('.task-item');
        let visibleTasks = [];
        
        tasks.forEach(task => {
            let isVisible = false;
            
            switch (currentFilter) {
                case 'active':
                    isVisible = !task.classList.contains('completed');
                    break;
                case 'completed':
                    isVisible = task.classList.contains('completed');
                    break;
                default: // 'all'
                    isVisible = true;
            }
            
            // 表示状態を設定
            task.style.display = 'none'; // 一旦すべて非表示
            
            if (isVisible) {
                visibleTasks.push(task);
            }
        });
        
        return visibleTasks;
    }
    
    // ページネーション適用関数
    function applyPagination(visibleTasks) {
        // 表示するタスクの範囲を計算
        const startIndex = (currentPage - 1) * tasksPerPage;
        const endIndex = startIndex + tasksPerPage;
        
        // 表示範囲内のタスクのみ表示
        visibleTasks.forEach((task, index) => {
            if (index >= startIndex && index < endIndex) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
        
        // 表示状態が変わったのでタスクテキストの状態を更新
        setTimeout(setupTaskTexts, 50);
    }
    
    // フィルターとページネーションを組み合わせた関数
    function applyFilterAndPagination() {
        const visibleTasks = applyFilter();
        applyPagination(visibleTasks);
        updatePagination(visibleTasks.length);
    }
    
    // ページネーションの更新
    function updatePagination(totalVisibleTasks = null) {
        if (totalVisibleTasks === null) {
            // 表示されるタスクの総数を計算
            const visibleTasks = applyFilter();
            totalVisibleTasks = visibleTasks.length;
        }
        
        // 総ページ数を計算
        const totalPages = Math.max(1, Math.ceil(totalVisibleTasks / tasksPerPage));
        
        // 現在のページが範囲内に収まるように調整
        currentPage = Math.min(currentPage, totalPages);
        
        // ページ番号ボタンを生成
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.dataset.page = i;
            
            pageBtn.addEventListener('click', () => {
                currentPage = parseInt(pageBtn.dataset.page);
                applyFilterAndPagination();
            });
            
            pageNumbers.appendChild(pageBtn);
        }
        
        // 前へ・次へボタンの状態を更新
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        
        // 表示されるタスクを更新
        const visibleTasks = applyFilter();
        applyPagination(visibleTasks);
    }
    
    // 前へ・次へボタンのイベントリスナー
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applyFilterAndPagination();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const visibleTasks = applyFilter();
        const totalPages = Math.ceil(visibleTasks.length / tasksPerPage);
        
        if (currentPage < totalPages) {
            currentPage++;
            applyFilterAndPagination();
        }
    });
    
    // 初期タスクのイベントリスナーを設定
    function setupInitialTasks() {
        const initialCheckboxes = document.querySelectorAll('.task-checkbox');
        const initialDeleteBtns = document.querySelectorAll('.btn-delete');
        
        initialCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const taskItem = this.closest('.task-item');
                
                if (this.checked) {
                    taskItem.classList.add('completed');
                    tasksList.appendChild(taskItem);
                } else {
                    taskItem.classList.remove('completed');
                    tasksList.prepend(taskItem);
                }
                
                applyFilterAndPagination();
            });
        });
        
        initialDeleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const taskItem = this.closest('.task-item');
                
                taskItem.style.opacity = '0';
                taskItem.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    taskItem.remove();
                    updatePagination();
                }, 300);
            });
        });
    }
    
    // 初期タスクのセットアップとページネーションの初期化
    setupInitialTasks();
    applyFilterAndPagination();
    
    // 初期タスクテキストの設定
    setupTaskTexts();
    
    // ドラッグ＆ドロップ機能（オプション）
    // let draggedItem = null;
    
    // function enableDragAndDrop() {
    //     document.addEventListener('dragstart', (e) => {
    //         if (e.target.classList.contains('task-item')) {
    //             draggedItem = e.target;
    //             setTimeout(() => {
    //                 e.target.style.opacity = '0.5';
    //             }, 0);
    //         }
    //     });
        
    //     document.addEventListener('dragend', (e) => {
    //         if (e.target.classList.contains('task-item')) {
    //             e.target.style.opacity = '1';
    //         }
    //     });
        
    //     document.addEventListener('dragover', (e) => {
    //         e.preventDefault();
    //     });
        
    //     tasksList.addEventListener('dragenter', (e) => {
    //         e.preventDefault();
    //         if (e.target.classList.contains('task-item') && e.target !== draggedItem) {
    //             e.target.style.borderTop = '2px solid var(--primary-color)';
    //         }
    //     });
        
    //     tasksList.addEventListener('dragleave', (e) => {
    //         if (e.target.classList.contains('task-item')) {
    //             e.target.style.borderTop = '';
    //         }
    //     });
        
    //     tasksList.addEventListener('drop', (e) => {
    //         e.preventDefault();
    //         if (e.target.classList.contains('task-item') && e.target !== draggedItem) {
    //             e.target.style.borderTop = '';
    //             tasksList.insertBefore(draggedItem, e.target);
    //             applyFilterAndPagination();
    //         }
    //     });
    // }
    
    // ドラッグ＆ドロップを有効化（オプション）
    // enableDragAndDrop();
}); 