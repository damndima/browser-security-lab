let currentCsrfToken = "";

function loadEmails() {
    fetch('/api/emails')
        .then(response => response.json())
        .then(emails => {
            const listContainer = document.getElementById('email-list');
            const contentContainer = document.getElementById('email-content');
            
            listContainer.innerHTML = ''; 

            if(emails.error) return;

            emails.forEach(email => {
                const div = document.createElement('div');
                div.className = 'email-item';
                div.style.display = 'flex';
                div.style.justifyContent = 'space-between';
                
                const textSpan = document.createElement('span');
                textSpan.innerText = `${email.subject} (від: ${email.sender})`;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Delete';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation(); 
                    
                    fetch(`/api/emails/delete/${email.id}`, {
                        method: 'POST',
                        headers: {
                            'x-csrf-token': currentCsrfToken
                        }
                    }).then(() => location.reload());
                };

                div.appendChild(textSpan);
                div.appendChild(deleteBtn);

                div.onclick = () => {
                    contentContainer.innerHTML = `<h3>Від: ${email.sender}</h3><h4>Тема: ${email.subject}</h4><p>${email.body}</p>`;
                };

                listContainer.appendChild(div);
            });
        });
}

document.getElementById('login-btn').onclick = () => {
    const usernameInput = document.getElementById('username-input').value.toLowerCase();
    
    fetch(`/login?username=${usernameInput}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentCsrfToken = data.token;
                document.getElementById('username').innerText = `Logged in as ${usernameInput}`;
                loadEmails();
            } else {
                alert("Помилка: Користувача не знайдено!");
            }
        });
};

document.getElementById('logout-btn').onclick = () => {
    fetch('/api/logout')
        .then(response => response.json())
        .then(data => {
            currentCsrfToken = ""; 
            document.getElementById('username').innerText = "Гість";
            document.getElementById('email-list').innerHTML = '';
            document.getElementById('email-content').innerHTML = '';
            alert("Серверний Logout успішний! Зомбі знищено.");
        });
};