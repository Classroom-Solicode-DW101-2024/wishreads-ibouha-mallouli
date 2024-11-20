// get wishlist from local storage
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Function to update the badge counter
function updateWishlistCounter() {
  const badge = document.querySelector(".badge");
  if (badge) badge.textContent = wishlist.length;
}

// Function to check if a book is in wishlist
function isBookInWishlist(bookTitle) {
  for (let i = 0; i < wishlist.length; i++) {
    if (wishlist[i].title === bookTitle) {
      return true;
    }
  }
  return false;
}

// Function to update heart icon style
function updateHeartIconStyle(icon, isInWishlist) {
  if (isInWishlist) {
    icon.style.background = "green";
    icon.style.color = "white";
  }
}

// Function to add a book to the wishlist
function addToWishlist(book) {
  if (!isBookInWishlist(book.title)) {
    wishlist.push(book);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCounter();
  } else {
    alert(`${book.title} is already in your wishlist.`);
  }
}

// Function to fetch books from `book.json`
async function getBooks() {
  try {
    const response = await fetch("book.json");
    const data = await response.json();
    
    // Return the 'books' array from the parsed data.
    return data.books;
  } catch (error) {
    console.error("Error fetching books:", error);
    
    return [];
  }
}


// Function to display books dynamically in the grid
function displayBooks(filteredBooks = null) {
  const bookGrid = document.querySelector(".book-grid");
  if (!bookGrid) return;

  getBooks().then((books) => {
    const booksToShow = filteredBooks || books;

      bookGrid.innerHTML = booksToShow.length ? booksToShow.map((book) => {
            // Find the original index of the book in the full books array
            const originalIndex = books.findIndex((b) => b.title === book.title);
            return `
                    <div class="book-card">
                        <img src="${book.cover}" class="book-image" alt="${book.title}">
                        <div class="hear-icon"
                            style="${isBookInWishlist(book.title)? "background: green; color: white;": ""}"
                            data-title="${book.title}"
                            data-cover="${book.cover}"
                            data-releasedate="${book.releaseDate}"
                            data-linkpdf="${book.linkPDF}">
                            <i class="fa-regular fa-heart"></i>
                        </div>
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">${book.author.fullName}</p>
                        <p class="book-release-date">${book.releaseDate}</p>
                        <a class="read-book" href="./book page/details.html?bookIndex=${originalIndex}">Details</a>
                    </div>
                `;
          }) .join("")  
          
          : "<p>No books found for your search .</p>";

      document.querySelectorAll(".hear-icon").forEach((icon) => {
        // to check if the book is in wishlist
        const bookTitle = icon.dataset.title;
        updateHeartIconStyle(icon, isBookInWishlist(bookTitle));
        // 
        icon.addEventListener("click", function () {
          const book = {
            title: icon.dataset.title,
            cover: icon.dataset.cover,
            releaseDate: icon.dataset.releasedate,
            linkPDF: icon.dataset.linkpdf,
          };
          addToWishlist(book);
          updateHeartIconStyle(icon, true);
        });
      });
    })
    .catch((error) => console.error("Error displaying books:", error));
}


// Function to handle the search
function handleSearch() {
  const searchInput = document.querySelector(".search-input");
  const categorySelect = document.querySelector(".category-select");
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;

  // Save search term and category to localStorage
  localStorage.setItem("searchTerm", searchTerm);
  localStorage.setItem("searchCategory", selectedCategory);

  // Redirect to index.html
  if (window.location.pathname === "/book%20page/details.html" || window.location.pathname === "/MyWishReads/MyWishReads.html") {
    window.location.href = "/";
  } else {
    window.location.href = window.location.pathname;
  }
}


// Function to initialize the search functionality
function initializeSearch() {
  const searchButton = document.querySelector(".search-button");
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);
  }

  // Check for search parameters on the index page
  const searchTerm = localStorage.getItem("searchTerm");
  const searchCategory = localStorage.getItem("searchCategory");

  if (searchTerm !== null || searchCategory !== null) {
    getBooks().then((books) => {
        const filteredBooks = books.filter((book) => {
          const matchesCategory =searchCategory === "All" || book.catergoy === searchCategory;
          const matchesTitle = book.title.toLowerCase().includes(searchTerm);
          return matchesCategory && matchesTitle;
        });
        displayBooks(filteredBooks);

        // Clear search parameters from localStorage after use
        localStorage.removeItem("searchTerm");
        localStorage.removeItem("searchCategory");
      })
      .catch((error) => console.error("Error during search:", error));
  } else {
    // Display all books if no search parameters exist
    displayBooks();
  }
}

// Initialize everything when the page loads
document.addEventListener("DOMContentLoaded", function () {
  updateWishlistCounter();
  initializeSearch();
});
