document.addEventListener("DOMContentLoaded", () => {
    fetch('book.json') 
        .then(response => response.json())
        .then(data => {
            const books = data.books;
            const grid = document.querySelector(".related-grid");

            // Shuffle and pick 5 random books
            const randomBooks = books.sort(() => 0.5 - Math.random()).slice(0, 5);
            grid.innerHTML = '';

            randomBooks.forEach(book => {
                const card = document.createElement('a');
                card.href = book.linkPDF;
                card.classList.add('book-card');
                card.target = "_blank"; 
                card.innerHTML = `
                    <img src="${book.cover}" alt="${book.title}" class="book-image">
                    <div class="hear-icon">
                        <i class="fa-regular fa-heart"></i>
                    </div>
                    <div class="book-rating">★★★★☆ <span>(4)</span></div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">${book.author.fullName}</p>
                    <button class="read-book">Read Now</button>
                `;

                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching books:", error);
        });
});
