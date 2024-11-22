document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const bookIndex = urlParams.get("bookIndex");
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  fetchBooks(bookIndex, wishlist);
});

// function to fetch books from json
function fetchBooks(bookIndex, wishlist) {
  fetch("../book.json")
    .then((response) => response.json())
    .then((data) => {
      const books = data.books;
      const book = books[bookIndex];

      displayBook(book, bookIndex, wishlist);
      displayRelatedBooks(books, book, bookIndex, wishlist);
      addWishlistListeners(books, wishlist);
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
}

// function to display book details
function displayBook(book, bookIndex, wishlist) {
  const isInWishlist = checkIfInWishlist(book, wishlist);
  const heartStyle = isInWishlist
    ? 'style="background: green; color: white;"'
    : "";

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

  // Update the heart icon style
  const heartIcon = document.querySelector(".hear-icon");
  if (heartIcon) {
    updateHeartIconStyle(heartIcon, isInWishlist);
  }
}

// function to display the related books
function displayRelatedBooks(books, book, bookIndex, wishlist) {
  const relatedBooks = books.filter(
    (item, index) =>
      item.catergoy === book.catergoy && index !== parseInt(bookIndex)
  );
  const limitedRelatedBooks = relatedBooks.slice(0, 5);

  const RelatedBooksHtml = document.querySelector(".highlights-grid");
  RelatedBooksHtml.innerHTML = "";

  limitedRelatedBooks.forEach((relatedBook, index) => {
    const relatedBookIndex = books.indexOf(relatedBook);
    const isRelatedInWishlist = checkIfInWishlist(relatedBook, wishlist);
    const relatedHeartStyle = isRelatedInWishlist
      ? 'style="background: green; color: white;"'
      : "";

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
    RelatedBooksHtml.appendChild(relatedCard);

    const heartIcon = relatedCard.querySelector(".add-wishlist");
    if (heartIcon) {
      updateHeartIconStyle(heartIcon, isRelatedInWishlist);
    }
  });

  if (limitedRelatedBooks.length === 0) {
    RelatedBooksHtml.innerHTML = `<p>No related products found.</p>`;
  }
}

// function to get the wishlist from the localstorage
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

// function to check if the book is in the wishlist
function checkIfInWishlist(book, wishlist) {
  return wishlist.some((item) => item.title === book.title);
}

// function to update teh span of the badge
function updateWishlistBadge() {
  const wishlist = getWishlist();
  const wishlistBadge = document.querySelector(".nav-right .badge");
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }
}

// function fo the add to wishlit icon style
function updateHeartIconStyle(icon, isInWishlist) {
  if (isInWishlist) {
    icon.style.background = "green";
    icon.style.color = "white";
  } else {
    icon.style.background = "";
    icon.style.color = "";
  }
}

function addWishlistListeners(books, wishlist) {
  const wishlistIcons = document.querySelectorAll(".hear-icon, .add-wishlist");

  wishlistIcons.forEach((icon) => {
    const bookIndex = icon.getAttribute("data-book-index");
    const book = books[bookIndex];

    if (checkIfInWishlist(book, wishlist)) {
      updateHeartIconStyle(icon, true);
    }

    icon.addEventListener("click", function () {
      let wishlist = getWishlist();
      handleWishlistToggle(book, wishlist, this);
    });
  });
}

function handleWishlistToggle(book, wishlist, icon) {
  if (!checkIfInWishlist(book, wishlist)) {
    // Add book to wishlist
    const bookToAdd = {
      title: book.title,
      cover: book.cover,
      releaseDate: book.releaseDate,
      linkPDF: book.linkPDF,
    };

    wishlist.push(bookToAdd);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistBadge();

    // Update the clicked icon's style
    icon.style.background = "green";
    icon.style.color = "white";
  } else {
    // Remove book from wishlist
    wishlist = wishlist.filter((item) => item.title !== book.title);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistBadge();

    // Reset the clicked icon's style
    icon.style.background = "";
    icon.style.color = "";
  }
}

// Update the wishlist badge initially
updateWishlistBadge();
