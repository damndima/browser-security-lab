document.cookie = "SessionID=123456";

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