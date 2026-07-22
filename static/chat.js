const input = document.getElementById("userInput");
const send = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

let sedangMengirim = false;

function toggleFormAktif(aktif){

    input.disabled = !aktif;
    send.disabled = !aktif;

    input.placeholder = aktif
        ? "Tanyakan materi apa saja..."
        : "AI sedang menjawab...";

    document.querySelectorAll(".suggestion button").forEach(btn => {
        btn.disabled = !aktif;
    });

    document.querySelectorAll(".subjects button").forEach(btn => {
        btn.disabled = !aktif;
    });

}

function tambahBubbleUser(pesan){
    chatBox.innerHTML += `
        <div class="user">
            <div class="bubble">${pesan}</div>
            <div class="avatar"><i class="fa-solid fa-user"></i></div>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function tambahBubbleAI(pesan){
    chatBox.innerHTML += `
        <div class="ai">
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="bubble">${pesan}</div>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function tambahBubbleLoading(){
    chatBox.innerHTML += `
        <div class="ai" id="loadingBubble">
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="bubble">Sedang mengetik...</div>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hapusBubbleLoading(){
    const loading = document.getElementById("loadingBubble");
    if(loading) loading.remove();
}

async function kirimPesan(){

    if(sedangMengirim) return;

    const pesan = input.value.trim();

    if(pesan === "") return;

    sedangMengirim = true;
    toggleFormAktif(false);

    tambahBubbleUser(pesan);

    input.value = "";

    tambahBubbleLoading();

    try {

        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: pesan })
        });

        const data = await response.json();

        hapusBubbleLoading();

        const jawaban = (data.reply || "Maaf, terjadi kesalahan.").replace(/\n/g, "<br>");

        tambahBubbleAI(jawaban);

    } catch (error) {

        hapusBubbleLoading();
        tambahBubbleAI("Gagal terhubung ke server. Coba lagi.");
        console.error(error);

    } finally {

        sedangMengirim = false;
        toggleFormAktif(true);
        input.focus();

    }

}

function kirimSaran(btn){
    if(sedangMengirim) return;
    input.value = btn.textContent;
    kirimPesan();
}

function pilihMapel(btn){
    if(sedangMengirim) return;
    const mapel = btn.textContent.trim();
    input.value = `Jelaskan materi dasar ${mapel} dan berikan contoh soalnya`;
    kirimPesan();
}

send.onclick = kirimPesan;

input.addEventListener("keypress", (e) => {

    if(e.key === "Enter"){
        kirimPesan();
    }

});