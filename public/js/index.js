// document.addEventListener('DOMContentLoaded', () => {
//     confirm('Are you sure you want to open this page?');
// });

// window.addEventListener('load', () => {
//     confirm('Are you sure you want to open this page?');
// });

// Home Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slides .slide-content');
const currentIndex = document.querySelector('.currentIndex');
const totalIndex = document.querySelector('.totalIndex');
let slideIndex = 0;
let totalSlides = slides.length

// Function to show slide at given index
function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.style.display = 'grid';
        } else {
            slide.style.display = 'none';
        }
    });
    // update the current slide index
    currentIndex.textContent = index + 1;
}

// Show initial slide
showSlide(slideIndex);

// update the total slides
totalIndex.textContent = totalSlides;

// Event listener for 'Next' button
document.querySelector('.next').addEventListener('click', function () {
    if (slideIndex < slides.length - 1) {
        slideIndex++;
        showSlide(slideIndex);
    }
});

// Event listener for 'Prev' button
document.querySelector('.prev').addEventListener('click', function () {
    if (slideIndex > 0) {
        slideIndex--;
        showSlide(slideIndex);
    }
});
