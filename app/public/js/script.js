document.addEventListener('DOMContentLoaded', () => {
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    allButtons.forEach(button => {
        button.addEventListener('click', () => {
            searchBar.classList.add('open');
            button.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        });
    });

    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
    });
});