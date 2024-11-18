// Function to fetch books from file.json
async function getBooks() {
    try {
        const response = await fetch('book.json');
        const data = await response.json();
        return data.books;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

// Function to display books in the grid
async function displayBooks() {
    const bookGrid = document.querySelector('.book-grid');
    // Get books from JSON file
    const books = await getBooks();
    
    bookGrid.innerHTML = '';
    
    books.forEach(book => {
        const bookHTML = `
            <div class="book-card">
                <img src="${book.cover}" class="book-image" alt="${book.title}">
                <div class="hear-icon"><i class="fa-regular fa-heart"></i></div>
                <div class="book-rating">★★★★☆ <span>(4)<span></div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author.fullName}</p>
                
                <a class="read-book" href="${book.linkPDF}">Read Now</a>
            </div>
        `;
        
        bookGrid.innerHTML += bookHTML;
    });
}

// Run when page loads
document.addEventListener('DOMContentLoaded', displayBooks);