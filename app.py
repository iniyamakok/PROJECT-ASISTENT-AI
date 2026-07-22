from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import OpenAI
import os
import sqlite3
from datetime import datetime

# Load .env
load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise ValueError("OPENROUTER_API_KEY tidak ditemukan di file .env")

client = OpenAI(
    api_key=API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

app = Flask(__name__)


# ==========================
# DATABASE SQLITE
# ==========================

def init_db():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT
    )
    """)

    conn.commit()
    conn.close()


def save_chat(role, message):
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO chats (role, message, created_at)
    VALUES (?, ?, ?)
    """, (
        role,
        message,
        datetime.now()
    ))

    conn.commit()
    conn.close()


def get_history():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT role, message 
    FROM chats
    ORDER BY id ASC
    """)

    chats = cursor.fetchall()

    conn.close()

    return [
        {
            "role": chat[0],
            "content": chat[1]
        }
        for chat in chats
    ]


init_db()


# ==========================
# ROUTE
# ==========================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/history")
def history():
    return jsonify(get_history())


@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    prompt = data.get("message", "")

    if not prompt:
        return jsonify({
            "reply": "Masukkan pertanyaan terlebih dahulu."
        })


    try:

        # Simpan pesan user
        save_chat("user", prompt)


        messages = [
            {
                "role": "system",
                "content": """
Kamu adalah asisten belajar AI untuk membantu siswa.

Gaya jawaban:
- Gunakan Bahasa Indonesia yang natural dan mudah dipahami.
- Berbicara seperti guru atau teman belajar.
- Jangan gunakan bahasa robot atau terlalu formal.
- Gunakan kalimat sederhana.
- Jelaskan agar siswa paham, bukan hanya memberi jawaban.

Aturan:
- Untuk matematika, jelaskan proses pengerjaan bertahap.
- Jangan hanya memberi rumus, jelaskan maksud setiap langkah.
- Untuk pilihan ganda, jelaskan alasan jawabannya.
- Jika diminta rangkuman, gunakan poin-poin.
- Jika diminta quiz, buat 5 soal beserta jawabannya.
- Jawab singkat jika pertanyaan sederhana.

Tujuan:
Jadilah tutor yang sabar, jelas, dan membantu siswa belajar.
"""
            }
        ]


        # Masukkan chat lama
        messages += get_history()


        response = client.chat.completions.create(
            model="openrouter/free",
            messages=messages
        )


        reply_text = response.choices[0].message.content


        # Simpan jawaban AI
        save_chat("assistant", reply_text)


        return jsonify({
            "reply": reply_text
        })


    except Exception as e:

        return jsonify({
            "reply": f"Terjadi error: {str(e)}"
        })



if __name__ == "__main__":
    app.run(debug=True)