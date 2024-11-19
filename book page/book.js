document
  .addEventListener("DOMContentLoaded", () => {
    // Get the student index from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookIndex = urlParams.get("bookIndex");

    fetch("../book.json")
      .then((response) => response.json())
      .then((data) => {
        const books = data.books;
        const book = books[bookIndex];
        const bookSection = document.querySelector(".book-section");

        bookSection.innerHTML = "";
        bookSection.innerHTML = `
                    <img src="${book.cover}" alt="">
            <div class="book-info">
                <h2 class="book-title">${book.title}</h2>
                <p class="book-category">${book.category}</p>             
                <p class="book-author"> <span>Author :</span>${book.author.fullName}</p>
                <p class="book-description">${book.description}</p>
                <hr>
                <a class="readBtn"><i class="fa-brands fa-readme"></i> READ</a> <a class="hear-icon"><i class="fa-regular fa-heart"></i></a>

            </div>
                `;

        bookSection.appendChild(card);
      });
  })
  .catch((error) => {
    console.error("Error fetching books:", error);
  });
