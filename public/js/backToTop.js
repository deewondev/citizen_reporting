const backToTopBtn = document.querySelector('#btp');

// window.addEventListener('scroll', () => {
//     if (window.scroll > 500) {
//         backToTopBtn.style.display = 'block';
//     } else {
//         backToTopBtn.style.display = 'none';
//     }
// });

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
