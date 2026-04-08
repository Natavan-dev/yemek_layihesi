const bcrypt = require('bcrypt');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const saltRounds = 10;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'yemek_layihesi',
    password: '0000', 
    port: 5432,
});

// 1. QEYDİYYAT
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );
        res.status(200).json({ message: "Qeydiyyat uğurludur!" });
    } catch (err) {
        res.status(500).json({ error: "Xəta baş verdi." });
    }
});

// 2. GİRİŞ (Hücum və Müdafiə hissəsi buradadır)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // --- BU TƏHLÜKƏSİZ VARIANTDIR (Hal-hazırda aktivdir) ---
        const query = 'SELECT * FROM users WHERE username = $1'; 
        const userResult = await pool.query(query, [username]);

        /* --- HÜCUM ÜÇÜN BURANI AÇ (Aşağıdakı 2 sətri aktiv et, yuxarıdakını bağla) ---*/
        //const query = `SELECT * FROM users WHERE username = '${username}'`; 
        //const userResult = await pool.query(query);
        

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            // --- NORMAL GİRİŞ ---
            if (isMatch) { 
                res.status(200).json({ message: "Giriş uğurludur!", user: { id: user.id, username: user.username } });
            } 
            /* --- HÜCUMU TAMAMLAMAQ ÜÇÜN BU BLOKU AKTİVLƏŞDİR (Bcrypt bypass) ---*/
            /*else if (username.includes("' OR '1'='1")) {
                res.status(200).json({ message: "SQL Injection Uğurlu!", user: { id: user.id, username: user.username } });
            } 
            */

            else {
                res.status(401).json({ error: "Şifrə yanlışdır!" });
            }

        } else {
            res.status(404).json({ error: "İstifadəçi tapılmadı." });
        }
    } catch (err) {
        res.status(500).json({ error: "SQL Xətası: " + err.message });
    }
});

// 3. SİFARİŞ
app.post('/order', async (req, res) => {
    const { username, food_name } = req.body;
    try {
        await pool.query('INSERT INTO orders (username, food_name) VALUES ($1, $2)', [username, food_name]);
        res.status(200).json({ message: "Sifariş qeyd edildi!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server 3000-ci portda işləyir: http://localhost:3000");
});