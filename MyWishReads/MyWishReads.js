document.addEventListener("DOMContentLoaded", () => {
  const wishlistContainer = document.querySelector(".book-list");
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  updateWishlistCounter();

  function updateWishlistCounter() {
    const badge = document.querySelector(".badge");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; 
    badge.textContent = wishlist.length;
  }

  // Function to display wishlist items
  function displayWishlist() {
    wishlistContainer.innerHTML = ""; 

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
                        <button class="delete-btn" data-index="${index}">READED</button>
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
    const bookIndex = event.target.dataset.index; 
    wishlist.splice(bookIndex, 1); 
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); 
    displayWishlist();
    updateWishlistCounter();
  }


  displayWishlist();
});
