let themeBtn = document.getElementById("themeBtn");

window.onload = function () {
    loadTheme();
    showTasks();
    startReminder();
    requestNotificationPermission();
};


function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

function loadTheme() {

    let saved = localStorage.getItem("darkMode");

    if (saved === "true") {
        document.body.classList.add("dark");
        themeBtn.textContent = "☀️";
    } else {
        themeBtn.textContent = "🌙";
    }
}

themeBtn.onclick = function () {

    document.body.classList.toggle("dark");

    let isDark = document.body.classList.contains("dark");

    localStorage.setItem("darkMode", isDark);

    themeBtn.textContent = isDark ? "☀️" : "🌙";
};



function addTask() {

    let text = taskInput.value.trim();
    let priorityVal = priority.value;
    let time = timeInput.value;
    let phone = phoneInput.value.trim();

    if (text === "" || time === "") {
        alert("Enter task and time!");
        return;
    }

    let task = {
        text,
        priority: priorityVal,
        time,
        phone,
        reminded: false
    };

    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    tasks.push(task);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    timeInput.value = "";
    phoneInput.value = "";

    showTasks();
}


function showTasks() {

    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    let html = "";

    tasks.forEach((t, i) => {

        html += `
        <li class="${t.priority.toLowerCase()}">
            <div class="task-data">
                <b>🔔 ${t.text}</b>
                <small>${t.priority} | ${new Date(t.time).toLocaleString()}</small>
            </div>

            <button class="delete-btn" onclick="deleteTask(${i})">✖</button>
        </li>
        `;
    });

    taskList.innerHTML = html;
}

function deleteTask(i) {

    let tasks = JSON.parse(localStorage.getItem("tasks"));

    tasks.splice(i, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    showTasks();
}



function clearAll() {

    if (confirm("Delete all tasks?")) {
        localStorage.removeItem("tasks");
        showTasks();
    }
}


function startReminder() {

    setInterval(() => {

        let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

        let now = new Date();
        let changed = false;

        tasks.forEach(t => {

            let alarmTime = new Date(t.time);

            if (!t.reminded && now >= alarmTime) {

                // Popup
                alert("⏰ ALARM: " + t.text);

                // Notification
                if (Notification.permission === "granted") {
                    new Notification("Task Reminder", {
                        body: t.text
                    });
                }

                // Sound
                let audio = new Audio(
                    "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
                );
                audio.play();

                t.reminded = true;
                changed = true;
            }

        });

        if (changed) {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

    }, 20000);
}