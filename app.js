const express = require('express');
const pgp = require('pg-promise')({});
const app = express();
const body_parser = require('body-parser');
const db = pgp({
    database: 'doto_db',
    user: 'postgres',
    host: 'localhost'
});
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});
app.use(express.static('public'));
app.use(body_parser.urlencoded({extended: false}));

app.get('/todos', function(req, resp, next){
   let q = "SELECT * FROM task ORDER BY id ASC";
   db.query(q)
    .then( tasks => {
        resp.render('todolist.html', {results: tasks});
    })
    .catch(next);
});

app.get('/todos/add', function(req, resp, next){
    resp.render("addform.html");
});

app.post('/submit', function(req, resp, next){
    let description = req.body.description;
    let q = "INSERT INTO task VALUES (DEFAULT, $1, false)";
    db.query(q, description)
        .then(()=> {
            resp.redirect('/todos');
        })
        .catch(next);
});

app.get('/todos/done/:id', function(req, resp, next){
   let id = parseInt(req.params.id, 10);
   let q = "UPDATE task SET done=true WHERE id=$1";
   db.query(q, id)
    .then(() => {
        resp.redirect('/todos');
    })
    .catch(next);
});

app.listen(8000, function(){
    console.log('Listening on port 8000. Starting server...');
});
