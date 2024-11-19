// Initialize wishlist array from local storage or start with an empty array
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Function to update the badge counter
function updateWishlistCounter() {
    const badge = document.querySelector('.badge');
    badge.textContent = wishlist.length; // Reflect the number of items in the wishlist
}

// Function to add a book to the wishlist
function addToWishlist(book) {
    if (!wishlist.some(item => item.title === book.title)) {
        wishlist.push(book); // Add the book to the wishlist array
        localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Save to local storage
        updateWishlistCounter(); // Update the counter
    } else {
        alert(`${book.title} is already in your wishlist.`);
    }
}

// Function to fetch books from `book.json`
async function getBooks() {
    try {
        const response = await fetch('book.json'); // Fetch book data
        const data = await response.json();
        return data.books; // Return the books array
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

// Function to display books dynamically in the grid
async function displayBooks() {
    const bookGrid = document.querySelector(".book-grid");
    // Get books from JSON file
    const books = await getBooks();
  
    bookGrid.innerHTML = "";
  
    // Using array to store HTML strings for better performance
    const htmlArray = [];
  
    for (let i = 0; i < books.length; i++) {
      const book = books[i];
      htmlArray.push(`
              <div class="book-card">
                  <img src="${book.cover}" class="book-image" alt="${book.title}">
                <div class="hear-icon" 
                     data-title="${book.title}" 
                     data-cover="${book.cover}" 
                     data-releasedate="${book.releaseDate}">
                    <i class="fa-regular fa-heart"></i>
                </div>
                  <h3 class="book-title">${book.title}</h3>
                  <p class="book-author">${book.author.fullName}</p>
                  
                  <a class="read-book" href="./book page/details.html?bookIndex=${i}">Read Now</a>
              </div>
          `);
    }
  
    // Set innerHTML once with all the HTML
    bookGrid.innerHTML = htmlArray.join("");// Append each book card to the grid
 

    // Add click event listeners to the heart icons
    document.querySelectorAll('.hear-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const book = {
                title: icon.dataset.title,
                cover: icon.dataset.cover,
                releaseDate: icon.dataset.releasedate
            };
            addToWishlist(book);
            icon.style .background = 'green';
            icon.style .color = 'white';
        });
    });
}

// Ensure everything is initialized correctly when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    updateWishlistCounter(); // Update the badge counter
    await displayBooks(); // Fetch and display books
});
