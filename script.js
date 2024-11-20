let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Function to update the badge counter
function updateWishlistCounter() {
    const badge = document.querySelector('.badge');
    badge.textContent = wishlist.length;
}

// Function to check if a book is in wishlist
function isBookInWishlist(bookTitle) {  
    for (let i = 0; i < wishlist.length; i++) {  
        if (wishlist[i].title === bookTitle) {  
            return true; // Book is in the wishlist  
        }  
    }  
    return false; // Book is not in the wishlist  
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
function displayBooks() {
    // Select the container where the books will be displayed
    const bookGrid = document.querySelector(".book-grid");

    // Fetch books data
    getBooks()
        .then(function(books) {
            // Clear the current content of the book grid
            bookGrid.innerHTML = "";

            // Use an array to store the generated HTML strings for better performance
            const htmlArray = [];

            // Loop through the books and generate the HTML for each book
            for (let i = 0; i < books.length; i++) {
                const book = books[i];
                // Check if the book is already in the wishlist
                const isInWishlist = isBookInWishlist(book.title);
                // Set the style for the heart icon based on wishlist status
                const heartStyle = isInWishlist ? 'style="background: green; color: white;"' : '';

                // Push the HTML for the book card into the array
                htmlArray.push(`
                    <div class="book-card">
                        <img src="${book.cover}" class="book-image" alt="${book.title}">
                        <div class="hear-icon" ${heartStyle}
                            data-title="${book.title}"
                            data-cover="${book.cover}"
                            data-releasedate="${book.releaseDate}"
                            data-linkpdf="${book.linkPDF}"> 
                            <i class="fa-regular fa-heart"></i>
                        </div>
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">${book.author.fullName}</p>
                        <a class="read-book" href="./book page/details.html?bookIndex=${i}">Details</a>
                    </div>
                `);
            }

            // Update the book grid's innerHTML with the generated HTML
            bookGrid.innerHTML = htmlArray.join("");

            // Add click event listeners to the heart icons
            document.querySelectorAll('.hear-icon').forEach(function(icon) {
                // Get the book title from the dataset
                const bookTitle = icon.dataset.title;

                // Update the initial style of the heart icon based on wishlist status
                updateHeartIconStyle(icon, isBookInWishlist(bookTitle));

                // Add a click event listener to the heart icon
                icon.addEventListener('click', function() {
                    // Create a book object from the icon's dataset attributes
                    const book = {
                        title: icon.dataset.title,
                        cover: icon.dataset.cover,
                        releaseDate: icon.dataset.releasedate,
                        linkPDF: icon.dataset.linkpdf,
                    };

                    // Add the book to the wishlist
                    addToWishlist(book);

                    // Update the heart icon's style to indicate it has been added to the wishlist
                    updateHeartIconStyle(icon, true);
                });
            });
        })
        .catch(function(error) {
            // Log any errors that occur while fetching or displaying books
            console.error('Error displaying books:', error);
        });
}


// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update the badge counter
    updateWishlistCounter();
    // Fetch and display books
    displayBooks();
});
