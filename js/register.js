// register.js
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('密码和确认密码不一致');
        return;
    }

    const newUser = {
        username: username,
        email: email,
        password: password
    };

    fetch('json/users.json')
        .then(response => response.json())
        .then(data => {
            data.users.push(newUser);

            // 将更新后的用户数据保存回 json/users.json
            return fetch('json/users.json', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        })
        .then(response => {
            if (response.ok) {
                showSuccessModal();
            } else {
                alert('注册失败，请重试');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('注册失败，请重试');
        });
});

function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>注册成功！</p>
            <button id="closeModal">确定</button>
        </div>
    `;

    document.body.appendChild(modal);

    const closeModal = document.getElementById('closeModal');
    closeModal.addEventListener('click', function() {
        document.body.removeChild(modal);
        window.location.href = 'login.html';
    });

    setTimeout(() => {
        document.body.removeChild(modal);
        window.location.href = 'login.html';
    }, 5000);
}