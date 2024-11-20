let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Function to update the badge counter
function updateWishlistCounter() {
    const badge = document.querySelector('.badge');
    badge.textContent = wishlist.length;
}

// Function to check if a book is in wishlist
function isBookInWishlist(bookTitle) {
    return wishlist.some(item => item.title === bookTitle);
}

// Function to update heart icon style
function updateHeartIconStyle(icon, isInWishlist) {
    if (isInWishlist) {
        icon.style.background = 'green';
        icon.style.color = 'white';
    }
}

// Function to add a book to the wishlist
function addToWishlist(book) {
    if (!isBookInWishlist(book.title)) {
        wishlist.push(book);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistCounter();
    } else {
        alert(`${book.title} is already in your wishlist.`);
    }
}

// Function to fetch books from `book.json`
async function getBooks() {
    try {
        const response = await fetch('book.json');
        const data = await response.json();
        return data.books;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

// Function to display books dynamically in the grid
async function displayBooks() {
    const bookGrid = document.querySelector(".book-grid");
    const books = await getBooks();
    
    bookGrid.innerHTML = "";
    
    // Using array to store HTML strings for better performance
    const htmlArray = [];
    
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const isInWishlist = isBookInWishlist(book.title);
        const heartStyle = isInWishlist ? 'style="background: green; color: white;"' : '';
        
        htmlArray.push(`
            <div class="book-card">
                <img src="${book.cover}" class="book-image" alt="${book.title}">
                <div class="hear-icon" ${heartStyle}
                    data-title="${book.title}"
                    data-cover="${book.cover}"
                    data-releasedate="${book.releaseDate}">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author.fullName}</p>
                <a class="read-book" href="./book page/details.html?bookIndex=${i}">Details</a>
            </div>
        `);
    }
    
    bookGrid.innerHTML = htmlArray.join("");

    // Add click event listeners to the heart icons
    document.querySelectorAll('.hear-icon').forEach(icon => {
        // Update initial style if book is in wishlist
        const bookTitle = icon.dataset.title;
        updateHeartIconStyle(icon, isBookInWishlist(bookTitle));

        icon.addEventListener('click', () => {
            const book = {
                title: icon.dataset.title,
                cover: icon.dataset.cover,
                releaseDate: icon.dataset.releasedate
            };
            addToWishlist(book);
            updateHeartIconStyle(icon, true);
        });
    });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    updateWishlistCounter(); // Update the badge counter
    await displayBooks(); // Fetch and display books
});