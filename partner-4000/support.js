const btn = document.createElement('button');
btn.innerText = "Chat with Support";
btn.style.position = "fixed";
btn.style.bottom = "20px";
btn.style.right = "20px";
btn.style.padding = "10px";
btn.style.cursor = "pointer";

document.body.appendChild(btn);

btn.onclick = () => {
    fetch('http://localhost:4000/api/messages')
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error("Помилка CORS (це нормально для Task 5):", error));
};
