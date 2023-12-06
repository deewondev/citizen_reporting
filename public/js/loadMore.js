import getTimeDiff from "./timeDiff.js";

document.addEventListener('DOMContentLoaded', function() {

const loadMoreButton = document.getElementById('load-more-btn');
let skip = document.querySelectorAll('.all-posts-card').length;

loadMoreButton.addEventListener('click', function() {
    loadMorePosts();
});

function loadMorePosts() {
    fetch(`/load-more?skip=${skip}`)
    .then(res => res.json())
    .then(newPosts => {
        if (newPosts.length > 0) {
            skip += newPosts.length;
            displayNewPosts(newPosts);
        } else {
            loadMoreButton.innerText = 'No More Posts';
            loadMoreButton.disabled = true;
            loadMoreButton.style.backgroundColor = 'lightgray';
            loadMoreButton.style.color = 'black';
        }
    })
    .catch (error => {
        console.log('Error fetching more posts: ', error.message);
    });
}

function displayNewPosts(posts) {
    // const allPostsContainer = document.querySelector('.all-posts');
    // const loadMore = document.querySelector('.load-more');
    // const newPost = document.createElement('article');
    //     newPost.classList.add('all-posts-card');
    //     newPost.innerHTML = `
    //         <a href="/post/${post._id}">
    //             <!-- Your post structure -->
    //         </a>
    //     `;
    // allPostsContainer.insertBefore(newPost, loadMore); // Append each new post to the container

    const loadMore = document.querySelector('.load-more');
    posts.forEach(post => {
        const postHTML = `
            <article class="all-posts-card">
                <a href="/post/${post._id}">
                    <div class="all-posts-tag">
                        <span class="tag-item"> ${post.category} </span>
                    </div>
                    <div class="all-posts-title">
                        <h3> ${post.title} </h3>
                    </div>
                    <div class="all-posts-excerpt">
                        <p> ${post.description} </p>
                    </div>
                    <div class="all-posts-meta">
                        <span class="read-time"> ${getTimeDiff(post.createdAt)} </span>
                    </div>
                </a>
            </article>
        `;
        loadMore.insertAdjacentHTML('beforebegin', postHTML);
    });
}

});
