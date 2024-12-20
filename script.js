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

// get wishlist from local storage
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Function to add a book to the wishlist
function addToWishlist(book) {
  // Check if the book already exists in the wishlist
  const bookIndex = wishlist.findIndex(
    (wishlistBook) => wishlistBook.title === book.title
  );

  if (bookIndex !== -1) {
    wishlist.splice(bookIndex, 1);
    alert(`${book.title} has been removed from your wishlist.`);
    const icon = document.querySelector(
      `.hear-icon[data-title="${book.title}"]`
    );
    updateHeartIconStyle(icon, false);
    displayBooks();
  } else {
    wishlist.push(book);
    alert(`${book.title} has been added to your wishlist.`);
  }

  // Update local storage and the wishlist counter
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCounter();
}

// Function to display books dynamically in the grid
function displayBooks(filteredBooks = null) {
  const bookGrid = document.querySelector(".book-grid");
  if (!bookGrid) return;

  getBooks()
    .then((books) => {
      const booksToShow = filteredBooks || books;

      bookGrid.innerHTML = booksToShow.length
        ? booksToShow
            .map((book) => {
              // Find the original index of the book in the full books array
              const originalIndex = books.findIndex(
                (b) => b.title === book.title
              );
              return `
                      <div class="book-card">
                          <img src="${book.cover}" class="book-image" alt="${
                book.title
              }">
                          <div class="hear-icon"
                              style="${
                                isBookInWishlist(book.title)
                                  ? "background: green; color: white;"
                                  : ""
                              }"
                              data-title="${book.title}"
                              data-cover="${book.cover}"
                              data-releasedate="${book.releaseDate}"
                              data-author="${book.author.fullName}"
                              data-linkpdf="${book.linkPDF}">
                              <i class="fa-regular fa-heart"></i>
                          </div>
                          <h3 class="book-title">${book.title}</h3>
                          <p class="book-author">${book.author.fullName}</p>
                          <p class="book-release-date">${book.releaseDate}</p>
                          <a class="read-book" href="./book page/details.html?bookIndex=${originalIndex}">Details</a>
                      </div>
                  `;
            })
            .join("")
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
            author: {
              fullName: icon.dataset.author,
            },
          };
          addToWishlist(book);
          updateHeartIconStyle(icon, true);
        });
      });
    })
    .catch((error) => console.error("Error displaying books:", error));
}

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
    icon.style.background = "green"; // Highlight the heart icon
    icon.style.color = "white";
  } else {
    icon.style.background = ""; // Reset to default
    icon.style.color = "";
  }
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
  if (
    window.location.pathname === "/book%20page/details.html" ||
    window.location.pathname === "/MyWishReads/MyWishReads.html"
  ) {
    window.location.href = "/";
  } else {
    // Call the search logic directly without reloading
    const searchTerm = localStorage.getItem("searchTerm");
    const searchCategory = localStorage.getItem("searchCategory");

    getBooks().then((books) => {
      const filteredBooks = books.filter((book) => {
        const matchesCategory =
          searchCategory === "All" || book.catergoy === searchCategory;
        const matchesTitle = book.title
          .trim()
          .toLowerCase()
          .includes(searchTerm);
        return matchesCategory && matchesTitle;
      });
      displayBooks(filteredBooks);
    });
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
    getBooks()
      .then((books) => {
        const filteredBooks = books.filter((book) => {
          // create a array that just countain the book object
          const matchesCategory =
            searchCategory === "All" || book.catergoy === searchCategory; // check if the book category is the same as the selected category
          const matchesTitle = book.title.toLowerCase().includes(searchTerm);
          return matchesCategory && matchesTitle; // return the answers
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
