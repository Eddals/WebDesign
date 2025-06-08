document.getElementById('book-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;
    const cover = document.getElementById('cover').value;

    const bookList = document.getElementById('book-list');
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
        <img src="${cover}" alt="Book Cover">
        <h2>${title}</h2>
        <p>Author: ${author}</p>
        <p>${description}</p>
    `;
    bookList.appendChild(bookCard);

    this.reset();
});
