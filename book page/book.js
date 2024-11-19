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
          <a class="hear-icon"><i class="fa-regular fa-heart"></i></a>
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
        relatedCard.innerHTML = `
        <img src="${relatedBook.cover}" alt="${
          relatedBook.title
        }" class="book-image">
        <div class="hear-icon">
            <i class="fa-regular fa-heart"></i>
        </div>
        <h3 class="book-title">${relatedBook.title}</h3>
        <p class="book-author">${relatedBook.author.fullName}</p>
        <a href="details.html?bookIndex=${books.indexOf(
          relatedBook
        )}" class="read-book">View Details</a>
    `;
        relatedGrid.appendChild(relatedCard);
      });

      // Handle case with no related books
      if (limitedRelatedBooks.length === 0) {
        relatedGrid.innerHTML = `<p>No related products found.</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
});
