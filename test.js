// When the page is fully loaded, execute the function
document.addEventListener("DOMContentLoaded", function () {
    // Get the book index from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookIndex = urlParams.get("bookIndex");
  
    // Retrieve wishlist data from localStorage or initialize it as an empty array
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  
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
          return (
            item.title === book.title ||
            (item.index !== undefined && item.index === bookIndex)
          );
        });
  
        // Set style for the heart icon if the book is in the wishlist
        const heartStyle = isInWishlist ? 'style="background: green; color: white;"': "";
  
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
  
 