const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: false,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!newBook.name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Catatan gagal ditambahkan",
    });
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const { reading } = request.query;
  if (reading == 1) {
    return getAllReadingBooksHandler(request, h, reading);
  } else if (reading == 0) {
    return getAllUnreadingBooksHandler(request, h, reading);
  }

  const book =
    books.length > 0
      ? books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }))
      : [];

  const response = h.response({
    status: "success",
    data: {
      books: book,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    if (book.readPage === book.pageCount) book.finished = true;
    const response = h.response({
      status: "success",
      data: {
        book: book,
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

const getAllReadingBooksHandler = (request, h, reading) => {
  const bookList =
    books.length > 0
      ? books
          .filter((book) => book.reading == reading)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }))
      : [];
  console.log(bookList);
  const response = h.response({
    status: "success",
    data: {
      books: bookList,
    },
  });
  response.code(200);
  return response;
};

const getAllUnreadingBooksHandler = (request, h, reading) => {
  const bookList =
    books.length > 0
      ? books
          .filter((book) => book.reading == reading)
          .map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }))
      : [];

  const response = h.response({
    status: "success",
    data: {
      books: bookList,
    },
  });
  response.code(200);
  return response;
};

const getIsFinishedBooksHandler = (request, h) => {};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((n) => n.id === id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((n) => n.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
