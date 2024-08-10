let userId = localStorage.getItem('userId');
let score = 100000000000;

document.getElementById('rabbit-pic').addEventListener('click', () => {
    fetch('/income', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    }).then(res => res.json()).then(data => {
        userId = data.userId;
        localStorage.setItem('userId', userId);
        score += 1;
        document.getElementById('score').textContent = `USDT-Cent: ${score}`;
        showPopup();
    });
});

document.getElementById('transfer-button').addEventListener('click', () => {
    window.location.href = '/transfer';
});

function showPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = '0.6$';
 popup.style.backgroundColor = 'gold'; // Adding gold background color
    popup.style.color = 'blue'; // Adding white text color
    
    popup.style.borderRadius = '5px'; // Adding rounded corners
    popup.style.position = 'fixed'; // Ensuring it stays fixed in the viewport
    popup.style.top = '50%'; // Centering vertically
    popup.style.padding = '6px 15px'; // Centering vertically

    popup.style.left = '50%'; // Centering horizontally
      document.body.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 400);
}
module.exports = score