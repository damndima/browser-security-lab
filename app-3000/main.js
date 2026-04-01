
fetch('/api/emails')
    .then(response => response.json())
    .then(emails => {
        const listContainer = document.getElementById('email-list');
        const contentContainer = document.getElementById('email-content');

        emails.forEach(email => {
            const div = document.createElement('div');
            div.className = 'email-item';
            div.innerText = `${email.subject} (від: ${email.sender})`;
            
            div.onclick = () => {
                contentContainer.innerHTML = `<h3>Від: ${email.sender}</h3><h4>Тема: ${email.subject}</h4><p>${email.body}</p>`;
            };

            listContainer.appendChild(div);
        });
    });


document.getElementById('login-btn').onclick = () => {
    const usernameInput = document.getElementById('username-input').value.toLowerCase();
    
    fetch(`/login?username=${usernameInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('username').innerText = `Logged in as ${usernameInput}`;
                console.log(data.message);
            } else {
                alert("Помилка: Користувача не знайдено!");
            }
        });
};

document.getElementById('logout-btn').onclick = () => {
    document.cookie = "SessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api;";
    
    document.getElementById('username').innerText = "Гість";
    alert("Ви вийшли з системи (але чи справді?)");
};