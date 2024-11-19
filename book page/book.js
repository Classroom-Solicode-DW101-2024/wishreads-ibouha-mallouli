document.addEventListener("DOMContentLoaded", () => {
  // Get the book index from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookIndex = urlParams.get("bookIndex");

  fetch("../book.json")
    .then((response) => response.json())
    .then((data) => {
      const books = data.books;
      const book = books[bookIndex];

      // Display the selected book details
      const bookSection = document.querySelector(".book-section");
      bookSection.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <div class="book-info">
          <h2 class="book-title">${book.title}</h2>
          <p class="book-category">${book.catergoy}</p>
          <p class="book-author"><span>Author:</span> ${book.author.fullName}</p>
          <p class="book-description">${book.description}</p>
          <hr>
          <a href="${book.linkPDF}" target="_blank" class="readBtn"><i class="fa-brands fa-readme"></i> READ</a>
          <a class="hear-icon" data-book-index="${bookIndex}"><i class="fa-regular fa-heart"></i></a>
        </div>
      `;

      // Filter related books by category
      const relatedBooks = books.filter(
        (item, index) =>
          item.catergoy === book.catergoy && index !== parseInt(bookIndex)
      );

      // Limit to 5 related books
      const limitedRelatedBooks = relatedBooks.slice(0, 5);

      // Display related books
      const relatedGrid = document.querySelector(".highlights-grid");
      relatedGrid.innerHTML = "";

      limitedRelatedBooks.forEach((relatedBook) => {
        const relatedCard = document.createElement("div");
        relatedCard.classList.add("highlights-card");
        const relatedBookIndex = books.indexOf(relatedBook);
        relatedCard.innerHTML = `
        <img src="${relatedBook.cover}" alt="${relatedBook.title}" class="related-image">
        <div class="add-wishlist" data-book-index="${relatedBookIndex}">
            <i class="fa-regular fa-heart"></i>
        </div>
        <h3 class="related-title">${relatedBook.title}</h3>
        <p class="related-author">${relatedBook.author.fullName}</p>
        <a href="details.html?bookIndex=${relatedBookIndex}" class="related-read-book">Details</a>
    `;
        relatedGrid.appendChild(relatedCard);
      });

      // Handle case with no related books
      if (limitedRelatedBooks.length === 0) {
        relatedGrid.innerHTML = `<p>No related products found.</p>`;
      }

      // Add event listeners for wishlist
      addWishlistListeners(books);
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
});


function updateWishlistBadge() {
  // Get wishlist from local storage
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Update badge in the navigation
  const wishlistBadge = document.querySelector('.nav-right .badge');
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
}


// Function to add wishlist event listeners
function addWishlistListeners(books) {
  // Select all heart icons
  const wishlistIcons = document.querySelectorAll('.hear-icon, .add-wishlist');
  
  wishlistIcons.forEach(icon => {
    icon.addEventListener('click', function() {

      const bookIndex = this.getAttribute('data-book-index');
      
      // Retrieve existing wishlist from local storage
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      
      // Check if the book is already in the wishlist
      const isBookInWishlist = wishlist.some(book => book.index === bookIndex);
      
      if (!isBookInWishlist) {
        // Add the book to wishlist
        const bookToAdd = books[bookIndex];
        wishlist.push({
          index: bookIndex,
          title: bookToAdd.title,
          author: bookToAdd.author.fullName,
          cover: bookToAdd.cover,
          releaseDate : bookToAdd.releaseDate,
        });
        
        // Save updated wishlist to local storage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
        

      } else {
        alert('Book is in the list');
      }
    });
  });
}

updateWishlistBadge();