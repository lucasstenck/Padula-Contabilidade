document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mainNavLinks = document.querySelector('.main-nav-links');
    const submenuLinks = document.querySelectorAll('.submenu > a');

    hamburger.addEventListener('click', (event) => {
        event.stopPropagation();
        mainNavLinks.classList.toggle('active');
        if (!mainNavLinks.classList.contains('active')) {
            document.querySelectorAll('.submenu.active-submenu').forEach(submenu => {
                submenu.classList.remove('active-submenu');
            });
        }
    });

    submenuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const clickedSubmenu = this.closest('.submenu');
            const isCurrentlyActive = clickedSubmenu.classList.contains('active-submenu');
            document.querySelectorAll('.submenu.active-submenu').forEach(submenu => {
                if (submenu !== clickedSubmenu) {
                    submenu.classList.remove('active-submenu');
                }
            });
            if (isCurrentlyActive) {
                clickedSubmenu.classList.remove('active-submenu');
            } else {
                clickedSubmenu.classList.add('active-submenu');
            }
        });
    });

    document.addEventListener('click', function(event) {
        const target = event.target;
        if (mainNavLinks.classList.contains('active') &&
            !mainNavLinks.contains(target) &&
            !hamburger.contains(target)) {
            mainNavLinks.classList.remove('active');
            document.querySelectorAll('.submenu.active-submenu').forEach(submenu => {
                submenu.classList.remove('active-submenu');
            });
        }
        if (!target.closest('.submenu') && !hamburger.contains(target)) {
            document.querySelectorAll('.submenu.active-submenu').forEach(submenu => {
                submenu.classList.remove('active-submenu');
            });
        }
    });

    // Carousel logic: mostra uma imagem por vez
    const slides = document.querySelectorAll('.carousel-slide');
    let currentIndex = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });
    }
    
    // Inicializar o carousel
    showSlide(currentIndex);

    // The following functions (exibeBusca, exibeSites, verIndice) are not directly related to the carousel fix
    // but are kept for completeness based on the provided script.js.
    let sitesAbertos = false;
    let indiceAberto = false;

    function exibeBusca() {
        const formBusca = document.getElementById("formBusca");
        const formBusca2 = document.getElementById("formBusca2");

        if (formBusca) {
            formBusca.style.display = 'none';
        }
        if (formBusca2) {
            formBusca2.style.display = 'block';
        }
    }

    function exibeSites() {
        const sitesElement = document.getElementById("sites");
        if (sitesElement) {
            if (!sitesAbertos) {
                sitesElement.style.display = 'block';
                sitesAbertos = true;
            } else {
                sitesElement.style.display = 'none';
                sitesAbertos = false;
            }
        }
    }

    function verIndice() {
        const indiceAtualElement = document.getElementById("indiceAtual");
        if (indiceAtualElement) {
            if (!indiceAberto) {
                indiceAtualElement.style.display = 'block';
                indiceAberto = true;
            } else {
                indiceAtualElement.style.display = 'none';
                indiceAberto = false;
            }
        }
    }

    document.addEventListener('click', (event) => {
        const target = event.target;
        const sitesButton = document.querySelector('[onclick="exibeSites()"]');
        const sitesElement = document.getElementById("sites");
        if (sitesAbertos && sitesElement && !sitesElement.contains(target) && (!sitesButton || !sitesButton.contains(target))) {
            sitesElement.style.display = 'none';
            sitesAbertos = false;
        }
        const indiceButton = document.querySelector('[onclick="verIndice()"]');
        const indiceAtualElement = document.getElementById("indiceAtual");
        if (indiceAberto && indiceAtualElement && !indiceAtualElement.contains(target) && (!indiceButton || !indiceButton.contains(target))) {
            indiceAtualElement.style.display = 'none';
            indiceAberto = false;
        }
    });
});