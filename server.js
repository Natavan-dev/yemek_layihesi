const bcrypt = require('bcrypt');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const saltRounds = 10; // Hash-ləmənin gücü

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'yemek_layihesi',
    password: '0000', // Sənin şifrən
    port: 5432,
});

// 1. Qeydiyyat marşrutu (YENİLƏNDİ - Hash-ləmə əlavə edildi)
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // BURADA ŞİFRƏNİ QARIŞDIRIRIQ (HASH)
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword] // Bazaya orijinal şifrəni yox, hashlənmişi göndəririk
        );
        res.status(200).json({ message: "Qeydiyyat uğurludur! (Şifrə hashləndi)" });
    } catch (err) {
        res.status(500).json({ error: "İstifadəçi mövcuddur və ya xəta: " + err.message });
    }
});

// 2. Giriş marşrutu (YENİLƏNDİ - Hash yoxlanışı əlavə edildi)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Əvvəlcə istifadəçini adına görə tapırıq
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        
        //tehlukeli variant
        //const query = `SELECT * FROM users WHERE username = '${username}'`; 
        //const userResult = await pool.query(query);
        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            
            // BURADA DAXİL EDİLƏN ŞİFRƏ İLƏ BAZADAKI HASH-İ MÜQAYİSƏ EDİRİK
            // sql injectionda şərhə alacağımız hissə
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                res.status(200).json({ message: "Giriş edildi", user: user });
            } else {
                res.status(401).json({ error: "Şifrə yanlışdır!" });
            }
           res.status(200).json({ message: "Giriş edildi (SQL Injection uğurlu!)", user: user });
        } else {
            res.status(404).json({ error: "İstifadəçi tapılmadı." });
        }
    } catch (err) {
        res.status(500).json({ error: "Server xətası." });
    }
});

// Sifariş API-ı eyni qalır
app.post('/order', async (req, res) => {
    const { username, food_name } = req.body;
    try {
        await pool.query(
            'INSERT INTO orders (username, food_name) VALUES ($1, $2)',
            [username, food_name]
        );
        res.status(200).json({ message: "Sifarişiniz bazaya qeyd edildi!" });
    } catch (err) {
        res.status(500).json({ error: "Sifariş zamanı xəta: " + err.message });
    }
});

app.listen(3000, () => {
    console.log("Server 3000-ci portda işləyir. http://localhost:3000");
});
