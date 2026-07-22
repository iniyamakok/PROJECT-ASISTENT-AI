// ==========================
// HEADER SCROLL
// ==========================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        header.style.background = "rgba(13,17,23,.95)";
        header.style.boxShadow = "0 5px 20px rgba(0,0,0,.4)";

    }else{

        header.style.background = "rgba(13,17,23,.8)";
        header.style.boxShadow = "none";

    }

});


// ==========================
// SCROLL ANIMATION
// ==========================

const hiddenElements = document.querySelectorAll(
".feature,.subject,.card,.stat,#about"
);

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0px)";

        }

    });

});

hiddenElements.forEach(el=>{

    el.style.opacity="0";
    el.style.transform="translateY(40px)";
    el.style.transition=".7s";

    observer.observe(el);

});


// ==========================
// COUNTING NUMBER
// ==========================

const counters = document.querySelectorAll(".stat h2");

counters.forEach(counter=>{

    const target = counter.innerText;

    const number = parseInt(target);

    if(isNaN(number)) return;

    let count = 0;

    const speed = number / 80;

    function update(){

        count += speed;

        if(count < number){

            counter.innerText = Math.floor(count);

            requestAnimationFrame(update);

        }else{

            if(target.includes("+")){

                counter.innerText = number + "+";

            }

            else if(target.includes("%")){

                counter.innerText = number + "%";

            }

            else{

                counter.innerText = number;

            }

        }

    }

    update();

});


// ==========================
// SUBJECT CLICK
// ==========================

const subjects = document.querySelectorAll(".subject");

subjects.forEach(subject=>{

    subject.addEventListener("click",()=>{

        const name = subject.innerText.trim();

        alert(
        "Kamu memilih mata pelajaran:\n\n" + name +
        "\n\nNantinya halaman Chat AI akan langsung terbuka."
        );

    });

});


// ==========================
// BUTTON EFFECT
// ==========================

const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn=>{

    btn.addEventListener("mouseenter",()=>{

        btn.style.transform="translateY(-5px) scale(1.03)";

    });

    btn.addEventListener("mouseleave",()=>{

        btn.style.transform="translateY(0px)";

    });

});


// ==========================
// SMOOTH NAV
// ==========================

document.querySelectorAll('nav a').forEach(anchor=>{

    anchor.addEventListener('click',function(e){

        const href=this.getAttribute("href");

        if(href.startsWith("#")){

            e.preventDefault();

            document.querySelector(href).scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});


// ==========================
// HERO TEXT EFFECT
// ==========================

const title = document.querySelector(".hero-left h1");

let scale = 1;

setInterval(()=>{

    scale = scale === 1 ? 1.01 : 1;

    title.style.transform = `scale(${scale})`;

},1000);


// ==========================
// PAGE LOADED
// ==========================

window.onload = ()=>{

    console.log("SchoolAI berhasil dimuat.");

};