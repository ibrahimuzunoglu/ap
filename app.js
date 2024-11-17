// Kayıt formu için
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Kullanıcı bilgilerini al
    const username = document.getElementById('regUsername').value;
    const surname = document.getElementById('regSurname').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phonenumber = document.getElementById('regPhoneNumber').value;
    const location = document.getElementById('regLocation').value;

    // Sunucuya POST isteği gönder
    const apiUrll = process.env.NEXT_PUBLIC_API_URL || 'https://ap-wine.vercel.app'; // fallback URL
    const response = await fetch(`${apiUrll}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, surname, email, password, phonenumber, location }),
    });

    const result = await response.json();
    document.getElementById('message').innerText = result.message;
});

// Giriş formu için
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Giriş bilgilerini al
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log(email,password)

    // Sunucuya POST isteği gönder
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ap-wine.vercel.app'; // fallback URL
    const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    document.getElementById('message').innerText = result.message;

    // Eğer giriş başarılıysa, token'ı localStorage'a kaydet ve yönlendir
    if (result.token) {
        localStorage.setItem('token', result.token);
        window.location.href = './index.html';
    }
});

// home.html'a erişimi kontrol et
if (window.location.pathname === './index.html') {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Bu sayfayı görüntülemek için giriş yapmalısınız!');
        window.location.href = './login.html'; // Giriş sayfasına yönlendir
    }
}

