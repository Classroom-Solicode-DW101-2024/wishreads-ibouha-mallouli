// Function to fetch books from file.json
async function getBooks() {
  try {
    const response = await fetch("book.json");
    const data = await response.json();
    return data.books;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

// Function to display books in the grid
async function displayBooks() {
  const bookGrid = document.querySelector(".book-grid");
  // Get books from JSON file
  const books = await getBooks();

  bookGrid.innerHTML = "";

  // Using array to store HTML strings for better performance
  const htmlArray = [];

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    htmlArray.push(`
            <div class="book-card">
                <img src="${book.cover}" class="book-image" alt="${book.title}">
                <div class="hear-icon"><i class="fa-regular fa-heart"></i></div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author.fullName}</p>
                
                <a class="read-book" href="./book page/details.html?bookIndex=${i}">Read Now</a>
            </div>
        `);
  }

  // Set innerHTML once with all the HTML
  bookGrid.innerHTML = htmlArray.join("");
}
// Run when page loads
document.addEventListener("DOMContentLoaded", displayBooks);
