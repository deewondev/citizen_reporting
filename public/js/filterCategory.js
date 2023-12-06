document.addEventListener('DOMContentLoaded', function() {
    const categorySelect = document.querySelector('#category');

    categorySelect.addEventListener('change', function() {
        const selectedCategory = categorySelect.value;
        fetchPostsByCategory(selectedCategory);
    });

    function fetchPostsByCategory(category) {
        const allPosts = document.querySelectorAll('.all-posts-card');

        allPosts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            if (category === 'all' || category === postCategory) {
                post.style.display = 'block'; // Show posts that match the category or show all if 'All' is selected
            } else {
                post.style.display = 'none'; // Hide posts that don't match the selected category
            }
        });
        // fetch(`/?category=${category}`)
        // .then(res => res.json())
        // .then(data => {
        //     updatePostsUI(data);
        // })
        // .catch(error => console.log(error.message));
    }

    // function updatePostsUI(posts) {
    //     const allPostsContainer = document.querySelector('.all-posts-container');

    //     // Clear the existing posts before adding the new ones
    //     allPostsContainer.innerHTML = '';

    //     posts.forEach(post => {
    //         const postArticle = document.createElement('article');
    //         postArticle.classList.add('all-posts-card');

    //         // Creating the post structure based on the retrieved data
    //         postArticle.innerHTML = `
    //             <a href="/post/${post._id}">
    //                 <div class="all-posts-tag">
    //                     <span class="tag-item">${post.category}</span>
    //                 </div>
    //                 <div class="all-posts-title">
    //                     <h3>${post.title}</h3>
    //                 </div>
    //                 <div class="all-posts-excerpt">
    //                     <p>${post.description}</p>
    //                 </div>
    //                 <div class="all-posts-meta">
    //                     <span class="read-time">${post.createdAt}</span>
    //                 </div>
    //             </a>
    //         `;

    //         allPostsContainer.appendChild(postArticle);
    //     });
    // }
});
