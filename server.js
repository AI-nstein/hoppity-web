const express = require('express')
const bodyParser = require("body-parser")

const { find_bug, find_bug_test } = require("./handlers/find_bug")

app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

const PORT = process.env.PORT || 8086

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))

app.get('/', function(req, res) {
    res.redirect('/home')
})

app.get('/home', function(req, res) {
    res.render('pages/index')
})

app.get('/features', function(req, res) {
    res.render('pages/features')
})

app.get('/people', function(req, res) {
    res.render('pages/people')
})

app.get('/publications', function(req, res) {
    res.render('pages/publications')
})

app.get('/sponsors', function(req, res) {
    res.render('pages/sponsors')
})

app.get('/demo', function(req, res) {
    res.render('pages/demo')
})

app.get('/find_bug', find_bug_test)

app.post('/find_bug', find_bug)

app.get('*', function(req, res) {
    res.render('pages/404')
})
