// When the page is fully loaded, execute the function
document.addEventListener("DOMContentLoaded", function () {
  // Get the book index from the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bookIndex = urlParams.get("bookIndex");

  // Retrieve wishlist data from localStorage or initialize it as an empty array
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // Fetch the books data from the JSON file
  fetch("../book.json")
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          const books = data.books;
          const book = books[bookIndex];

          // Check if the current book is in the wishlist
          const isInWishlist = wishlist.some(function (item) {
              return item.title === book.title || (item.index !== undefined && item.index === bookIndex);
          });

          // Set style for the heart icon if the book is in the wishlist
          const heartStyle = isInWishlist ? 'style="background: green; color: white;"' : '';

          // Display the selected book details in the book section
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
                  <a class="hear-icon" data-book-index="${bookIndex}" ${heartStyle}><i class="fa-regular fa-heart"></i></a>
              </div>
          `;

          // Filter out related books by the same category
          const relatedBooks = books.filter(function (item, index) {
              return item.catergoy === book.catergoy && index !== parseInt(bookIndex);
          });

          // Limit the related books to 5 items
          const limitedRelatedBooks = relatedBooks.slice(0, 5);

          // Display related books in the grid
          const relatedGrid = document.querySelector(".highlights-grid");
          relatedGrid.innerHTML = "";

          limitedRelatedBooks.forEach(function (relatedBook) {
              const relatedBookIndex = books.indexOf(relatedBook);
              const isRelatedInWishlist = wishlist.some(function (item) {
                  return item.title === relatedBook.title || (item.index !== undefined && item.index === relatedBookIndex.toString());
              });
              const relatedHeartStyle = isRelatedInWishlist ? 'style="background: green; color: white;"' : '';

              // Create the related book card and add it to the grid
              const relatedCard = document.createElement("div");
              relatedCard.classList.add("highlights-card");
              relatedCard.innerHTML = `
                  <img src="${relatedBook.cover}" alt="${relatedBook.title}" class="related-image">
                  <div class="add-wishlist" data-book-index="${relatedBookIndex}" ${relatedHeartStyle}>
                      <i class="fa-regular fa-heart"></i>
                  </div>
                  <h3 class="related-title">${relatedBook.title}</h3>
                  <p class="related-author">${relatedBook.author.fullName}</p>
                  <a href="details.html?bookIndex=${relatedBookIndex}" class="related-read-book">Details</a>
              `;
              relatedGrid.appendChild(relatedCard);
          });

          if (limitedRelatedBooks.length === 0) {
              relatedGrid.innerHTML = `<p>No related products found.</p>`;
          }

          // Add event listeners for adding/removing books from wishlist
          addWishlistListeners(books);
      })
      .catch(function (error) {
          console.error("Error fetching books:", error);
      });
});

// Function to update the wishlist badge with the number of items in the wishlist
function updateWishlistBadge() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlistBadge = document.querySelector('.nav-right .badge');
  if (wishlistBadge) {
      wishlistBadge.textContent = wishlist.length;
  }
}

// Function to check if a book is in the wishlist
function isBookInWishlist(bookIndex, bookTitle) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  return wishlist.some(function (item) {
      return item.title === bookTitle || (item.index !== undefined && item.index === bookIndex);
  });
}

// Function to update the heart icon style when the book is added to the wishlist
function updateHeartIconStyle(icon) {
  icon.style.background = 'green';
  icon.style.color = 'white';
}

// Function to add event listeners for the wishlist heart icons
function addWishlistListeners(books) {
  const wishlistIcons = document.querySelectorAll('.hear-icon, .add-wishlist');
  
  wishlistIcons.forEach(function (icon) {
      const bookIndex = icon.getAttribute('data-book-index');
      const book = books[bookIndex];

      // If the book is in the wishlist, update the heart icon style
      if (isBookInWishlist(bookIndex, book.title)) {
          updateHeartIconStyle(icon);
      }

      // Add click event to add/remove books from the wishlist
      icon.addEventListener('click', function () {
          let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
          
          if (!isBookInWishlist(bookIndex, book.title)) {
              const bookToAdd = {
                  index: bookIndex,
                  title: book.title,
                  author: book.author.fullName,
                  cover: book.cover,
                  releaseDate: book.releaseDate,
              };
              
              wishlist.push(bookToAdd);
              localStorage.setItem('wishlist', JSON.stringify(wishlist));
              updateWishlistBadge();
              updateHeartIconStyle(this);
          } else {
              alert('Book is already in the wishlist');
          }
      });
  });
}

// Update the wishlist badge initially
updateWishlistBadge();
