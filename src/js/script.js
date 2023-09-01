document.addEventListener('DOMContentLoaded', function() {
  const templateSource = document.querySelector('#template-book').innerHTML;
  const booksListElement = document.querySelector('.books-list');
  const filterCheckboxes = document.querySelectorAll('input[name="filter"]');
  const favoriteBooks = []

  const template = Handlebars.compile(templateSource);

  function determineRatingColor(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)'
    } else if (rating <= 8) {
      return '#b4df5d'
    } else if (rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)'
    } else {
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)'
    }
  }


  function renderBooks() {
    booksListElement.innerHTML = '';

    const filters = {
      adults: false,
      nonFiction: false
    };

    filterCheckboxes.forEach(checkbox => {
      filters[checkbox.value] = checkbox.checked;
    });

    dataSource.books.forEach(book => {

      let shouldBeHidden = false

      for (const filter in filters) {
        if (filters[filter] && !book.details[filter]) {
          shouldBeHidden = true
          break
        }
      }

      if (shouldBeHidden) {
        const bookHtml = template(book)
        const bookElement = utils.createDOMFromHTML(bookHtml)
        bookElement.querySelector('.book__image').classList.add('hidden')
        booksListElement.appendChild(bookElement)
      } else {
        const bookHTML = template(book)
        const bookElement = utils.createDOMFromHTML(bookHTML)

        if (favoriteBooks.includes(book.id)) {
          bookElement.querySelector('.book__image').classList.add('favorite')
        }

        const ratingColor = determineRatingColor(book.rating)
        const ratingElement = bookElement.querySelector('.book__rating__fill')
        ratingElement.style.background = ratingColor

        const ratingWidth = book.rating * 10
        ratingElement.style.width = ratingWidth + '%'

        bookElement.querySelector('.book__image').classList.add('book__image')
        booksListElement.appendChild(bookElement)
      }

      // if (
      //   (filters.adults && !book.details.adults) ||
      //           (filters.nonFiction && !book.details.nonFiction)
      // ) {
      //   return;
      // }

      // const bookHTML = template(book);
      // const bookElement = utils.createDOMFromHTML(bookHTML);
      //
      // if (favoriteBooks.includes(book.id)) {
      //   bookElement.querySelector('.book__image').classList.add('favorite')
      // }
      //
      // bookElement.querySelector('.book__image').classList.add('book__image')
      // booksListElement.appendChild(bookElement)

      // bookElement.querySelector('.book__image').addEventListener('click', () => {
      //   if (favoriteBooks.includes(book.id)){
      //     const index = favoriteBooks.indexOf(book.id)
      //     if (index>-1) {
      //       favoriteBooks.splice(index, 1)
      //     }
      //     bookElement.querySelector('.book__image').classList.remove('favorite')
      //   } else {
      //     favoriteBooks.push(book.id)
      //     bookElement.querySelector('.book__image').classList.add('favorite')
      //   }
      // })
    });
  }

  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', renderBooks);
  });

  booksListElement.addEventListener('dblclick', function (event) {
    const clickedElement = event.target

    if (clickedElement.classList.contains('book__image')){
      const bookElement = clickedElement.closest('.book')
      const bookId = bookElement.getAttribute('data-id')

      if (favoriteBooks.includes(bookId)){
        const index = favoriteBooks.indexOf(bookId)
        if (index > -1) {
          favoriteBooks.splice(index, 1)
        }
        clickedElement.classList.remove('favorite')
      }else {
        favoriteBooks.push(bookId)
        clickedElement.classList.add('favorite')
      }
    }
  })


  renderBooks();
});
