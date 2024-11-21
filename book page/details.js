document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookIndex = urlParams.get('bookIndex');
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || []);

  fetch("../book.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data){
    const books = data.books;
    const book = books[bookIndex];


    // Check if the current book is already in the wishlist
    let isInWishlist = false;
    for (let i = 0; i < wishlist.length; i++) {
        let item = wishlist[i];
    
        if (item.title === book.title || item.index === bookIndex) {
            isInWishlist = true;
            break;
        }
    }
    const heartStyle = isInWishlist ? 'style="background: green; color: white;"': "";
    

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
       const relatedBooks = [];
       for (let i = 0; i < books.length; i++) {
        let item = books[i];
        if (item.catergoy === book.catergoy && i !== parseInt(bookIndex)) {
            relatedBooks.push(item);
        }
      }
       const limitedRelatedBooks = relatedBooks.slice(0, 5);
 
       // Display related books in the grid
       const relatedGrid = document.querySelector(".highlights-grid");
       relatedGrid.innerHTML = "";
 
       limitedRelatedBooks.forEach(function (relatedBook) {
         const relatedBookIndex = books.indexOf(relatedBook);
          // Check if the related book is already in the wishlist
          let isRelatedInWishlist = false;
         for (let i = 0; i < wishlist.length; i++) {
             let item = wishlist[i];
              if (item.title === relatedBook.title || item.index === relatedBookIndex) {
                 isRelatedInWishlist = true;
                 break;
             }
         } const relatedHeartStyle = isRelatedInWishlist? 'style="background: green; color: white;"': "";
 
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
    };
       addWishlistListeners(books);
     })
     .catch(function (error) {
       console.error("Error fetching books:", error);
     });
 });
 
 // Function to update the wishlist badge with the number of items in the wishlist
 function updateWishlistBadge() {
   const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
   const wishlistBadge = document.querySelector(".nav-right .badge");
   if (wishlistBadge) {
     wishlistBadge.textContent = wishlist.length;
   }
 }

 function updateHeartIconStyle(icon) {
  icon.style.background = "green";
  icon.style.color = "white";
} 

 // Function to check if a book is in the wishlist
 function isBookInWishlist(bookTitle) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  for (let i = 0; i < wishlist.length; i++) {
      const item = wishlist[i];
      if (item && item.title === bookTitle) {
          return true;
      }
  } return false;
}

  
 // Function to add event listeners for the wishlist heart icons
 function addWishlistListeners(books) {
   let wishlistIcons = document.querySelectorAll(".hear-icon, .add-wishlist");

   for(let i= 0; i < wishlistIcons.length; i++){
    let icon = wishlistIcons[i];
    let bookIndex = icon.getAttribute("data-book-index");
    let book = books[bookIndex];

     if (isBookInWishlist(book.title)) {
       updateHeartIconStyle(icon);
     }
 
       // Add click event to add/remove books from the wishlist
       icon.addEventListener('click', function () {
           let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
           
           if (!isBookInWishlist( book.title)) {
               const bookToAdd = {
                   title: book.title,
                   cover: book.cover,
                   releaseDate: book.releaseDate,
                   linkPDF: book.linkPDF
               };
               
               wishlist.push(bookToAdd);
               localStorage.setItem('wishlist', JSON.stringify(wishlist));
               updateWishlistBadge();
               updateHeartIconStyle(this);
           } else {
               alert('Book is already in the wishlist');
           }
       });
   };
 }
 
 // Update the wishlist badge initially
 updateWishlistBadge();
 