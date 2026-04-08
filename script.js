
/*const API_URL = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', () => {
    const toggleLink = document.getElementById('toggleAuth');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const formTitle = document.getElementById('form-title');
    const linkText = document.getElementById('link-text');
    const loginForm = document.getElementById('loginForm');

    // Qeydiyyat və Giriş forması arasında keçid
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (registerBtn.style.display === 'none') {
            // Qeydiyyat rejiminə keç
            formTitle.innerText = "Qeydiyyat";
            loginBtn.style.display = 'none';
            registerBtn.style.display = 'block';
            toggleLink.innerText = "Girişə qayıt";
            linkText.innerText = "Artıq hesabınız var?";
        } else {
            // Giriş rejiminə keç
            formTitle.innerText = "Giriş";
            loginBtn.style.display = 'block';
            registerBtn.style.display = 'none';
            toggleLink.innerText = "Qeydiyyatdan keçin";
            linkText.innerText = "Hesabınız yoxdur?";
        }
    });

    // Giriş (Login) Hadisəsi
    loginForm.addEventListener('submit', async (e) => {
        if (loginBtn.style.display === 'none') return; // Qeydiyyat rejimindədirsə işləməsin
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                // Burada uğurlu girişdən sonra istiqamətləndirmə edə bilərsən
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert("Server xətası!");
        }
    });
});

// Qeydiyyat Funksiyası (Sənin yazdığın funksiya)
async function register() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if (!user || !pass) {
        alert("Zəhmət olmasa xanaları doldurun!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            // Qeydiyyatdan sonra giriş formasına qaytarmaq üçün:
            document.getElementById('toggleAuth').click();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Xəta:", error);
        alert("Bağlantı xətası!");
    }
}
*/








