document.addEventListener("DOMContentLoaded", () => {
  const wishlistContainer = document.querySelector(".book-list");
  const searchInput = document.querySelector(".serachInWishlist");
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; // Get wishlist from local storage
  const readedBooks = JSON.parse(localStorage.getItem("readedBooks")) || []; // Get readed books from local storage
  updateWishlistCounter();

  // Function to update the wishlist counter badge
  function updateWishlistCounter() {
    const badge = document.querySelector(".badge");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    badge.textContent = wishlist.length;
  }

  // Function to display wishlist items
  function displayWishlist(filteredBooks = null) {
    wishlistContainer.innerHTML = ""; // Clear the container before re-rendering

    const booksToDisplay = filteredBooks || wishlist;

    if (booksToDisplay.length === 0) {
      wishlistContainer.innerHTML = `<p class="empty-message">Your wishlist is empty!</p>`;
      return;
    }

    booksToDisplay.forEach((book, index) => {
      // Check if the book is already in the readedBooks list
      const isReaded = readedBooks.some(
        (readedBook) => readedBook.title === book.title
      );

      // Generate the HTML for each book item
      const bookHTML = `
                <div class="book-item" style="background-color: ${
                  isReaded ? "#c0dfc0" : "transparent"
                }">
                    <img src="${book.cover}" alt="${
        book.title
      }" class="book-cover" />
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <span class="book-date">Released: ${
                          book.releaseDate
                        }</span>
                       <p class="book-author">By: ${book.author.fullName}</p>

                    </div>
                    <div class="vertical-divider"></div>
                    <div class="button-group">
                        <a class="read-btn" href="${
                          book.linkPDF
                        }" target="_blank">PDF</a>
                        <button class="readed-btn" data-index="${index}" style="background-color: ${
        isReaded ? "orange" : "yellow"
      }">${isReaded ? "Mark As Read" : "Finish"}</button>
                        <button class="delete-btn" data-index="${index}">DELETE</button>
                    </div>
                </div>
            `;
      wishlistContainer.innerHTML += bookHTML;
    });

    // Attach event listeners to buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", deleteBook);
    });

    document.querySelectorAll(".readed-btn").forEach((button) => {
      button.addEventListener("click", readedStatus);
    });
  }

  // Function to delete a book from the wishlist
  function deleteBook(event) {
    const bookIndex = event.target.dataset.index;
    const selectedBook = wishlist[bookIndex];

    // Remove the book from the readedBooks list if it exists
    const existingBookIndex = readedBooks.findIndex(
      (readedBook) => readedBook.title === selectedBook.title
    );

    if (existingBookIndex !== -1) {
      readedBooks.splice(existingBookIndex, 1);
      localStorage.setItem("readedBooks", JSON.stringify(readedBooks));
    }

    wishlist.splice(bookIndex, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    displayWishlist();
    updateWishlistCounter();
  }

  // Function to toggle the "Readed" status of a book
  function readedStatus(event) {
    const bookIndex = event.target.dataset.index;
    const selectedBook = wishlist[bookIndex];

    // Check if the book is already in the readedBooks list
    const existingBookIndex = readedBooks.findIndex(
      (readedBook) => readedBook.title === selectedBook.title
    );

    if (existingBookIndex !== -1) {
      readedBooks.splice(existingBookIndex, 1);
    } else {
      readedBooks.push(selectedBook);
    }

    localStorage.setItem("readedBooks", JSON.stringify(readedBooks));

    displayWishlist();
  }

  function handleSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
      // If search input is empty, show the full wishlist
      displayWishlist();
      return;
    }

    const filteredBooks = wishlist.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.fullName.toLowerCase().includes(searchTerm)
    );

    displayWishlist(filteredBooks);
  }

  // Attach search event listener
  searchInput.addEventListener("keyup", handleSearch);

  // Initial render of the wishlist
  displayWishlist();
});
