document.addEventListener("DOMContentLoaded", () => {
  const wishlistContainer = document.querySelector(".book-list");
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateWishlistCounter();

  function updateWishlistCounter() {
    const badge = document.querySelector(".badge");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; // Load wishlist from local storage
    badge.textContent = wishlist.length; // Update badge with the wishlist count
  }

  // Function to display wishlist items
  function displayWishlist() {
    wishlistContainer.innerHTML = ""; // Clear the container

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `<p class="empty-message">Your wishlist is empty!</p>`;
      return;
    }

    wishlist.forEach((book, index) => {
      const bookHTML = `
                <div class="book-item">
                    <img src="${book.cover}" alt="${book.title}" class="book-cover" />
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <span class="book-date">Released: ${book.releaseDate}</span>
                    </div>
                    <div class="vertical-divider"></div>
                    <div class="button-group">
                        <a class="read-btn" href="${book.linkPDF}" target="_blank">Read</a>
                        <button class="delete-btn" data-index="${index}">DELETE</button>
                        
                    </div>
                </div>
            `;
      wishlistContainer.innerHTML += bookHTML;
    });

    // Attach event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", deleteBook);
    });
  }

  // Function to delete a book from the wishlist
  function deleteBook(event) {
    const bookIndex = event.target.dataset.index; // Get index from button
    wishlist.splice(bookIndex, 1); // Remove the selected book from the array
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Update local storage
    displayWishlist();
    updateWishlistCounter();
    // Refresh display
  }

  // Display the wishlist on page load
  displayWishlist();
});
