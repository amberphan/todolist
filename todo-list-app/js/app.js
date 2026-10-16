/**
 * To-Do List Application Logic
 * Implements real-time clock, personalized greetings, task management & footer statistics.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const clockElement = document.getElementById('realtime-clock');
    const clockPeriodElement = document.getElementById('clock-period');
    const dateElement = document.getElementById('realtime-date');
    const greetingSubtitle = document.getElementById('greeting-subtitle');
    const userNameElement = document.getElementById('user-name');

    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    const themeToggleBtn = document.getElementById('theme-toggle');

    const totalCountElement = document.getElementById('total-count');
    const activeCountElement = document.getElementById('active-count');
    const completedCountElement = document.getElementById('completed-count');
    const btnClearCompleted = document.getElementById('btn-clear-completed');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // --- Search & Sidebar Elements ---
    const searchInput = document.getElementById('search-input');
    const btnClearSearch = document.getElementById('btn-clear-search');
    const searchStats = document.getElementById('search-stats');
    const searchMatchesCount = document.getElementById('search-matches-count');
    const priorityFilterMenu = document.getElementById('priority-filter-menu');

    // --- Deadline & Overdue Alert Elements ---
    const taskDeadlineInput = document.getElementById('task-deadline');
    const overdueBanner = document.getElementById('overdue-banner');
    const overdueCountElement = document.getElementById('overdue-count');
    const btnViewOverdue = document.getElementById('btn-view-overdue');
    const sidebarOverdueCount = document.getElementById('sidebar-overdue-count');

    // --- Keys & State ---
    const STORAGE_KEY = 'todo_tasks';
    const THEME_KEY = 'todo_theme';
    const USER_NAME_KEY = 'todo_app_username';
    let currentFilter = 'all';
    let currentPriorityFilter = 'all';
    let searchQuery = '';

    /* ==========================================================================
       THEME MANAGEMENT (DARK / LIGHT MODE & LOCALSTORAGE PERSISTENCE)
       ========================================================================== */
    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
            document.body.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.body.classList.remove('dark-theme');
        }
    }

    function toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        document.documentElement.classList.toggle('dark-theme', isDark);
        // Lưu trạng thái 'dark' hoặc 'light' vào LocalStorage
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    }

    // Khởi tạo theme ban đầu từ LocalStorage
    initTheme();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    /* ==========================================================================
       LOCALSTORAGE FUNCTIONS (Định nghĩa trước khi gọi khởi tạo)
       ========================================================================== */
    // 1. Đọc dữ liệu từ LocalStorage khi khởi chạy / tải lại trang (F5)
    function loadTasksFromLocalStorage() {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            // Nếu đã từng có dữ liệu lưu trong LocalStorage (kể cả mảng rỗng [])
            if (storedData !== null) {
                return JSON.parse(storedData);
            }
        } catch (error) {
            console.error('Lỗi khi đọc dữ liệu từ LocalStorage:', error);
        }

        // Dữ liệu mẫu ban đầu nếu người dùng lần đầu tiên truy cập ứng dụng
        const defaultTasks = [
            {
                id: 'task-1',
                text: 'Thiết kế giao diện To-Do List hiện đại và bắt mắt',
                completed: true,
                priority: 'important',
                dueDate: '2026-10-16T18:00',
                createdAt: '08:30:00'
            },
            {
                id: 'task-2',
                text: 'Thực hiện chức năng đồng hồ thời gian thực (Giờ/Phút/Giây)',
                completed: false,
                priority: 'important',
                dueDate: '2026-10-16T19:00',
                createdAt: '09:15:00'
            },
            {
                id: 'task-3',
                text: 'Lập trình tính năng thêm, xóa và thống kê công việc',
                completed: false,
                priority: 'normal',
                dueDate: '2026-10-17T12:00',
                createdAt: '10:00:00'
            }
        ];

        // Lưu ngay dữ liệu mẫu vào LocalStorage cho lần đầu
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
        } catch (e) {
            console.error('Không thể khởi tạo LocalStorage:', e);
        }

        return defaultTasks;
    }

    // 2. Lưu danh sách công việc vào LocalStorage dưới dạng mảng JSON
    function saveTasksToLocalStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu vào LocalStorage:', error);
        }
    }

    // Khởi tạo mảng tasks từ LocalStorage ngay khi mở hoặc F5 lại trang
    let tasks = loadTasksFromLocalStorage();

    // Load user name or default to 'Phúc'
    const savedName = localStorage.getItem(USER_NAME_KEY) || 'Phúc';
    userNameElement.textContent = savedName;

    // Allow user to click name to edit
    userNameElement.addEventListener('click', () => {
        const newName = prompt('Nhập tên của bạn:', userNameElement.textContent);
        if (newName && newName.trim()) {
            const trimmed = newName.trim();
            userNameElement.textContent = trimmed;
            localStorage.setItem(USER_NAME_KEY, trimmed);
        }
    });

    /* ==========================================================================
       1. REAL-TIME CLOCK & GREETING
       ========================================================================== */
    function updateClock() {
        const now = new Date();

        // Hours, Minutes, Seconds formatting with leading zeros
        const rawHours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const period = rawHours >= 12 ? 'PM' : 'AM';
        
        // 24-hour or 12-hour format (displaying full 24h standard with leading zeros)
        const formattedHours = String(rawHours).padStart(2, '0');
        clockElement.textContent = `${formattedHours}:${minutes}:${seconds}`;
        clockPeriodElement.textContent = period;

        // Vietnamese Date formatting
        const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = daysOfWeek[now.getDay()];
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        dateElement.textContent = `${dayName}, ngày ${day} tháng ${month}, ${year}`;

        // Dynamic context message based on time of day
        if (rawHours >= 5 && rawHours < 12) {
            greetingSubtitle.textContent = 'Chào buổi sáng! Hãy bắt đầu ngày mới với những mục tiêu tuyệt vời.';
        } else if (rawHours >= 12 && rawHours < 18) {
            greetingSubtitle.textContent = 'Chào buổi chiều! Giữ vững phong độ và hoàn thành tốt công việc nhé.';
        } else {
            greetingSubtitle.textContent = 'Chào buổi tối! Xem lại những việc đã làm và thư giãn nhé.';
        }
    }

    // Start clock immediately and run every second
    updateClock();
    setInterval(() => {
        updateClock();
        updateOverdueAlerts();
    }, 1000);

    /* ==========================================================================
       DEADLINE & EXPIRATION CALCULATION FUNCTIONS
       ========================================================================== */
    // Định dạng và tính toán trạng thái hạn chót (thời gian hết hạn)
    function formatDeadlineStatus(dueDateStr, isCompleted) {
        if (!dueDateStr) return null;
        const due = new Date(dueDateStr);
        if (isNaN(due.getTime())) return null;

        const now = new Date();
        const diffMs = due.getTime() - now.getTime();
        const isOverdue = diffMs < 0;

        // Định dạng ngày giờ hiển thị: Giờ:Phút Ngày/Tháng/Năm
        const hours = String(due.getHours()).padStart(2, '0');
        const minutes = String(due.getMinutes()).padStart(2, '0');
        const day = String(due.getDate()).padStart(2, '0');
        const month = String(due.getMonth() + 1).padStart(2, '0');
        const year = due.getFullYear();
        const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;

        if (isCompleted) {
            return {
                type: 'completed',
                label: `Hạn: ${formattedDate}`,
                badgeClass: 'badge-deadline-done',
                icon: 'fa-calendar-check'
            };
        }

        if (isOverdue) {
            const overdueMin = Math.abs(Math.floor(diffMs / (1000 * 60)));
            let timeAgo = '';
            if (overdueMin < 60) {
                timeAgo = `Quá hạn ${overdueMin} phút`;
            } else if (overdueMin < 60 * 24) {
                timeAgo = `Quá hạn ${Math.floor(overdueMin / 60)} giờ`;
            } else {
                timeAgo = `Quá hạn ${Math.floor(overdueMin / (60 * 24))} ngày`;
            }
            return {
                type: 'overdue',
                label: `${timeAgo} (${formattedDate})`,
                badgeClass: 'badge-deadline-overdue',
                icon: 'fa-triangle-exclamation'
            };
        }

        // Sắp hết hạn (trong vòng 24 giờ)
        const remainMin = Math.floor(diffMs / (1000 * 60));
        if (remainMin <= 60 * 24) {
            let remainText = '';
            if (remainMin < 60) {
                remainText = `Còn ${remainMin} phút`;
            } else {
                remainText = `Còn ${Math.floor(remainMin / 60)} giờ`;
            }
            return {
                type: 'expiring',
                label: `Sắp hết hạn: ${remainText} (${formattedDate})`,
                badgeClass: 'badge-deadline-expiring',
                icon: 'fa-stopwatch'
            };
        }

        return {
            type: 'future',
            label: `Hạn chót: ${formattedDate}`,
            badgeClass: 'badge-deadline-future',
            icon: 'fa-calendar'
        };
    }

    // Cập nhật banner cảnh báo và số lượng việc quá hạn ở Sidebar
    function updateOverdueAlerts() {
        const now = new Date();
        const overdueList = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now);
        const count = overdueList.length;

        if (overdueBanner && overdueCountElement) {
            if (count > 0) {
                overdueBanner.style.display = 'flex';
                overdueCountElement.textContent = count;
            } else {
                overdueBanner.style.display = 'none';
            }
        }

        if (sidebarOverdueCount) {
            if (count > 0) {
                sidebarOverdueCount.style.display = 'inline-block';
                sidebarOverdueCount.textContent = count;
            } else {
                sidebarOverdueCount.style.display = 'none';
            }
        }
    }

    function renderTasks() {
        // Clear list
        taskList.innerHTML = '';

        // Filter tasks: Status (all/active/completed), Priority, Overdue, and Search Query
        const filteredTasks = tasks.filter(task => {
            // Lọc theo trạng thái
            if (currentFilter === 'active' && task.completed) return false;
            if (currentFilter === 'completed' && !task.completed) return false;

            // Lọc theo mục "Đã quá hạn" ở Sidebar
            if (currentPriorityFilter === 'overdue') {
                if (task.completed || !task.dueDate || new Date(task.dueDate) >= new Date()) {
                    return false;
                }
            } else if (currentPriorityFilter !== 'all' && (task.priority || 'normal') !== currentPriorityFilter) {
                return false;
            }

            // Lọc theo ô Input "Tìm kiếm bài viết" ở Sidebar (Real-time Search)
            if (searchQuery) {
                const textLower = task.text.toLowerCase();
                if (!textLower.includes(searchQuery)) {
                    return false;
                }
            }

            return true;
        });

        // Cập nhật số lượng bài viết tìm thấy ở Sidebar
        if (searchStats && searchMatchesCount) {
            if (searchQuery) {
                searchStats.style.display = 'block';
                searchMatchesCount.textContent = filteredTasks.length;
            } else {
                searchStats.style.display = 'none';
            }
        }

        // Show / Hide empty state
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'flex';
            const h3 = emptyState.querySelector('h3');
            const p = emptyState.querySelector('p');
            if (searchQuery) {
                if (h3) h3.textContent = 'Không tìm thấy bài viết!';
                if (p) p.textContent = `Không có bài viết nào khớp với từ khóa "${escapeHtml(searchQuery)}".`;
            } else if (currentPriorityFilter === 'overdue') {
                if (h3) h3.textContent = 'Không có việc nào quá hạn!';
                if (p) p.textContent = 'Tuyệt vời! Bạn đang hoàn thành tất cả công việc đúng tiến độ.';
            } else {
                if (h3) h3.textContent = 'Chưa có công việc nào!';
                if (p) p.textContent = 'Thêm các mục tiêu hoặc nhiệm vụ mới để bắt đầu sắp xếp ngày của bạn.';
            }
        } else {
            emptyState.style.display = 'none';
        }

        // Thông tin hiển thị mức độ ưu tiên
        const priorityMeta = {
            important: { label: 'Quan trọng', badgeClass: 'badge-important', icon: 'fa-triangle-exclamation' },
            normal: { label: 'Bình thường', badgeClass: 'badge-normal', icon: 'fa-circle-info' },
            low: { label: 'Thấp', badgeClass: 'badge-low', icon: 'fa-arrow-down' }
        };

        // Render items
        filteredTasks.forEach(task => {
            const currentPriority = task.priority || 'normal';
            const p = priorityMeta[currentPriority] || priorityMeta.normal;
            const deadlineInfo = formatDeadlineStatus(task.dueDate, task.completed);
            const overdueClass = (deadlineInfo && deadlineInfo.type === 'overdue') ? 'status-overdue' : '';

            const li = document.createElement('li');
            li.className = `task-item priority-${currentPriority} ${overdueClass} ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <div class="task-left">
                    <button type="button" class="custom-checkbox" aria-label="Đánh dấu hoàn thành" title="${task.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <div class="task-info">
                        <div class="task-title-row">
                            <span class="task-text">${highlightMatch(task.text, searchQuery)}</span>
                            <span class="priority-badge ${p.badgeClass}">
                                <i class="fa-solid ${p.icon}"></i> ${p.label}
                            </span>
                        </div>
                        <span class="task-meta">
                            <span><i class="fa-regular fa-clock"></i> Tạo lúc ${task.createdAt || '--:--'}</span>
                            ${deadlineInfo ? `
                                <span class="deadline-badge ${deadlineInfo.badgeClass}">
                                    <i class="fa-solid ${deadlineInfo.icon}"></i> ${deadlineInfo.label}
                                </span>
                            ` : ''}
                        </span>
                    </div>
                </div>
                <button type="button" class="btn-delete" aria-label="Xóa công việc" title="Xóa công việc">
                    <i class="fa-regular fa-trash-can"></i>
                    <span>Xóa</span>
                </button>
            `;

            const taskText = li.querySelector('.task-text');
            const checkbox = li.querySelector('.custom-checkbox');
            const deleteBtn = li.querySelector('.btn-delete');

            // 1. Khi click vào văn bản của một công việc: thêm/xóa class 'completed' để gạch ngang chữ (line-through)
            taskText.addEventListener('click', () => {
                toggleTask(task.id);
            });

            // Đồng thời cho phép click vào checkbox để toggle
            checkbox.addEventListener('click', () => {
                toggleTask(task.id);
            });

            // 2. Khi click vào nút 'Xóa': phần tử công việc biến mất với hiệu ứng mờ dần (fade out)
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();

                // Thêm class 'fade-out' để chạy hiệu ứng CSS mờ dần và thu nhỏ
                li.classList.add('fade-out');

                // Lắng nghe sự kiện kết thúc hiệu ứng animation rồi mới xóa phần tử
                li.addEventListener('animationend', () => {
                    deleteTask(task.id);
                }, { once: true });

                // Dự phòng an toàn nếu trình duyệt không kích hoạt animationend
                setTimeout(() => {
                    if (tasks.some(t => t.id === task.id)) {
                        deleteTask(task.id);
                    }
                }, 380);
            });

            taskList.appendChild(li);
        });

        // Update statistics in footer
        updateStats();
    }

    function addTask(text) {
        const trimmed = text.trim();
        
        // Kiểm tra nếu ô nhập trống thì hiển thị alert
        if (!trimmed) {
            alert('Vui lòng nhập nội dung!');
            taskInput.focus();
            return;
        }

        const selectedPriority = prioritySelect ? prioritySelect.value : 'normal';
        const deadline = taskDeadlineInput ? taskDeadlineInput.value : '';
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        const newTask = {
            id: 'task-' + Date.now(),
            text: trimmed,
            completed: false,
            priority: selectedPriority, // 'important' | 'normal' | 'low'
            dueDate: deadline,          // Thời gian hết hạn (Deadline)
            createdAt: timeStr
        };

        // Thêm công việc mới vào đầu mảng và lưu vào LocalStorage
        tasks.unshift(newTask);
        saveTasksToLocalStorage();
        renderTasks();

        // Xóa nội dung trong ô input sau khi thêm thành công và reset priority & deadline
        taskInput.value = '';
        if (prioritySelect) {
            prioritySelect.value = 'normal';
        }
        if (taskDeadlineInput) {
            taskDeadlineInput.value = '';
        }
        taskInput.focus();

        // Cuộn mượt lên đầu danh sách
        const taskSection = document.querySelector('.task-section');
        if (taskSection) {
            taskSection.scrollTop = 0;
        }
    }

    // Đánh dấu hoàn thành / chưa hoàn thành và lưu vào LocalStorage
    function toggleTask(id) {
        const target = tasks.find(t => t.id === id);
        if (target) {
            target.completed = !target.completed;
            saveTasksToLocalStorage();
            renderTasks();
        }
    }

    // Xóa công việc và cập nhật lại LocalStorage
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasksToLocalStorage();
        renderTasks();
    }

    // Xóa tất cả công việc đã hoàn thành và lưu vào LocalStorage
    function clearCompleted() {
        tasks = tasks.filter(t => !t.completed);
        saveTasksToLocalStorage();
        renderTasks();
    }

    /* ==========================================================================
       3. FOOTER STATS
       ========================================================================== */
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;

        totalCountElement.textContent = total;
        activeCountElement.textContent = active;
        completedCountElement.textContent = completed;

        // Show/hide Clear Completed button
        if (completed > 0) {
            btnClearCompleted.style.display = 'inline-flex';
        } else {
            btnClearCompleted.style.display = 'none';
        }
    }

    /* ==========================================================================
       4. EVENT LISTENERS
       ========================================================================== */
    // Form submit: Xử lý khi người dùng nhấn nút 'Thêm' hoặc phím Enter trong ô input
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
    });

    // Clear completed button
    btnClearCompleted.addEventListener('click', clearCompleted);

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // ==========================================================================
    // SIDEBAR: TÌM KIẾM BÀI VIẾT THỜI GIAN THỰC (REAL-TIME SEARCH) & BỘ LỌC
    // ==========================================================================
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            // Ẩn/Hiện nút Xóa nhanh từ khóa tìm kiếm
            if (btnClearSearch) {
                btnClearSearch.style.display = searchQuery ? 'flex' : 'none';
            }
            // Real-time Search: Tự động vẽ lại danh sách ngay khi gõ từng ký tự
            renderTasks();
        });
    }

    if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            searchQuery = '';
            btnClearSearch.style.display = 'none';
            renderTasks();
        });
    }

    // Bộ lọc mức độ ưu tiên & quá hạn ở Sidebar
    if (priorityFilterMenu) {
        const menuItems = priorityFilterMenu.querySelectorAll('.sidebar-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                currentPriorityFilter = item.dataset.priority || 'all';
                renderTasks();
            });
        });
    }

    // Nút "Xem chi tiết" ở Banner Cảnh Báo Quá Hạn
    if (btnViewOverdue) {
        btnViewOverdue.addEventListener('click', () => {
            currentPriorityFilter = 'overdue';
            if (priorityFilterMenu) {
                const items = priorityFilterMenu.querySelectorAll('.sidebar-menu-item');
                items.forEach(i => {
                    if (i.dataset.priority === 'overdue') i.classList.add('active');
                    else i.classList.remove('active');
                });
            }
            renderTasks();
            const taskSection = document.querySelector('.task-section');
            if (taskSection) {
                taskSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Utility: HTML Sanitizer to prevent XSS
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Utility: Regex Escape
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Utility: Highlight matching keywords in task title
    function highlightMatch(text, query) {
        const safeText = escapeHtml(text);
        if (!query) return safeText;
        const safeQuery = escapeRegex(escapeHtml(query));
        const regex = new RegExp(`(${safeQuery})`, 'gi');
        return safeText.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // Initial render
    renderTasks();
});
