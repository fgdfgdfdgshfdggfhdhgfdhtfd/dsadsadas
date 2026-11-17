/* ═══════════════════════════════════════════════════════════════════════
   header-auth.js — pulsanti Wishlist / Login / Sign Up nella barra in alto del portale download
   (stesso aspetto e stesse classi del sito principale, su desktop e mobile).

   Il portale non ha Firebase né account: i pulsanti portano al sito principale, che apre subito
   la finestra giusta:
     globalfind.netlify.app/#wishlist   /#login   /#signup
   (il sito principale gestisce questi tre indirizzi in app.js, sezione INIT).
══════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';
    var MAIN_SITE = 'https://globalfind.netlify.app/';
    var TXT = {
        EN: { wishlist: 'Wishlist',        login: 'Login',          signup: 'Sign Up' },
        IT: { wishlist: 'Lista Desideri',  login: 'Accedi',         signup: 'Registrati' },
        ES: { wishlist: 'Lista de deseos', login: 'Iniciar sesión', signup: 'Registrarse' },
        FR: { wishlist: 'Favoris',         login: 'Connexion',      signup: "S'inscrire" },
        DE: { wishlist: 'Wunschliste',     login: 'Anmelden',       signup: 'Registrieren' }
    };

    /* lingua: quella del browser (il localStorage del sito principale è un altro dominio e qui non è leggibile) */
    function lang() {
        var l = 'EN';
        try { l = String((navigator.language || 'en').slice(0, 2)).toUpperCase(); } catch (e) {}
        return TXT[l] ? l : 'EN';
    }
    function go(h) { window.location.href = MAIN_SITE + (h ? '#' + h : ''); }
    window.gfHeaderGo = go;

    function render() {
        var T = TXT[lang()];
        var desktop = document.getElementById('auth-area-header');
        var mobile  = document.getElementById('mobile-header-right-controls');

        if (desktop) {
            desktop.innerHTML =
                '<button type="button" onclick="gfHeaderGo(\'wishlist\')" class="hbtn-auth hbtn-wishlist" style="position:relative;" aria-label="' + T.wishlist + '">' +
                '<i class="fa-solid fa-heart"></i><span class="hbtn-label-text">' + T.wishlist + '</span></button>' +
                '<button type="button" onclick="gfHeaderGo(\'login\')" class="hbtn-auth hbtn-login" aria-label="' + T.login + '">' +
                '<i class="fa-solid fa-right-to-bracket"></i><span class="hbtn-label-text">' + T.login + '</span></button>' +
                '<button type="button" onclick="gfHeaderGo(\'signup\')" class="hbtn-auth hbtn-signup" aria-label="' + T.signup + '">' +
                '<i class="fa-solid fa-user-plus"></i><span class="hbtn-label-text">' + T.signup + '</span></button>';
        }

        if (mobile) {
            mobile.innerHTML =
                '<button type="button" onclick="gfHeaderGo(\'wishlist\')" class="hbtn-auth hbtn-wishlist" style="position:relative;" aria-label="' + T.wishlist + '">' +
                '<i class="fa-solid fa-heart"></i><span class="hbtn-micro-label">' + T.wishlist.split(' ')[0] + '</span></button>' +
                '<button type="button" onclick="gfHeaderGo(\'login\')" class="hbtn-auth hbtn-login" style="position:relative;" aria-label="' + T.login + '">' +
                '<i class="fa-solid fa-right-to-bracket"></i><span class="hbtn-micro-label">' + T.login + '</span></button>' +
                '<button type="button" onclick="gfHeaderGo(\'signup\')" class="hbtn-auth hbtn-signup" style="position:relative;" aria-label="' + T.signup + '">' +
                '<i class="fa-solid fa-user-plus"></i><span class="hbtn-micro-label">' + T.signup + '</span></button>';
        }
    }

    render();
    window.addEventListener('pageshow', function (e) { if (e.persisted) render(); });
})();
