const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Books API', () => {
    it('Should POST a book', (done) => {
        const book = { id: "1", title: "Test Book", author: "Test Author" };
        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                book.id = res.body.id;
                done();
            });
    });

    it('Should GET all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('Should GET a single book', (done) => {
        const bookId = 1;
        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                done();
            });
    });

    it('Should PUT an existing book', (done) => {
        const bookId = 1;
        const updatedBook = { id: bookId, title: "Updated Test Book", author: "Updated Test Author" };
        chai.request(server)
            .put(`/books/${bookId}`)
            .send(updatedBook)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.title).to.equal(updatedBook.title);
                expect(res.body.author).to.equal(updatedBook.author);
                done();
            });
    });

    it('Should DELETE an existing book', (done) => {
        const book = { id: "2", title: "Another Test Book", author: "Another Test Author" };
        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                chai.request(server)
                    .delete(`/books/${book.id}`)
                    .end((err, res) => {
                        expect(res).to.have.status(204);
                        expect(res.body).to.be.a('object');
                        done();
                    });
            });
    });

    it('Should return 404 for non-existing book - GET, PUT, DELETE', (done) => {
        const bookId = 9999;
        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai.request(server)
            .put(`/books/${bookId}`)
            .send({ id: "9999", title: "Another Test Book", author: "Another Test Author" })
            .end((err, res) => {
                expect(res).to.have.status(404);
            });

        chai.request(server)
            .delete(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});