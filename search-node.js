var express = require('express');
var axios = require('axios');
require('dotenv').config();
const { request } = require('express');
var app = express();
const port = 4000

//different versions of the search website

// view engine setup
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('search')
})

//search site with iframe widget
app.get('/widget-test', (req, res) => {
    getToken()
        .then(token => {
            res.render('search-site', { 'token': token.data.id_token })
        })
})

//inline version of the widget with dropdown
app.get('/widget-dropdown', (req, res) => {
    console.log('here')
    getToken()
        .then(token => {
            res.render('search-inline', { 'token': token.data.id_token })
        })
})

//test dropdown as an iframe
app.get('/search-iframe-dropdown', (req, res) => {
    getToken()
        .then(token => {
            res.render('search-iframe-dropdown', { 'token': token.data.id_token })
        })
})

//widget for acting as an iframe
app.get('/iframe-dropdown', (req, res) => {
    res.render('iframe-dropdown', {'token': req.query.auth})
})

//not used
app.get('/widget-javascript', (req, res) => {
    res.sendFile('/Users/workWork/Documents/clipr-test-sites/widget-javascript.js')
})

//the inline widget code
app.get('/widget-inline', (req, res) => {
    res.render('widget-inline', {"token": req.query.auth})
})

//search widget for use as an iframe
app.get('/search-widget', (req, res) => {
    res.render('search-widget', {"token": req.query.auth})
})

//site for playing videos
app.get('/video-player', (req, res) =>{
    jobId = req.query['job-id']
    time = req.query.time
    res.render('video-player', {
        jobId: jobId,
        time: time
    })
})

//gets auth token mimics 'client' backend not currently used for widgets
app.get('/auth', (req, res) => {
    data = JSON.stringify({
        "grant_type": "http://auth0.com/oauth/grant-type/password-realm",
        "realm": "Machine-Authentication",
        "client_id": "vqvoRIBjwI3BuDNhN0EjqTbnaiDJfuAt",
        "username": process.env.CLIENT_USERNAME,
        "password": process.env.CLIENT_PASSWORD
    })
    var config = {
        method: 'post',
        url: 'https://auth.cliprai.dev/oauth/token/',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'did=s%3Av0%3A1eb95820-c3cc-11eb-b2f1-73efa82324fd.grmuchFntNCamg3YaUqvMKLvBoF58pSkkzes2%2Fp62ZI; did_compat=s%3Av0%3A1eb95820-c3cc-11eb-b2f1-73efa82324fd.grmuchFntNCamg3YaUqvMKLvBoF58pSkkzes2%2Fp62ZI'
        },
        data: data
    };
    axios(config)
        .then(function (response) {
            token = response.data.id_token
            console.log(token)
            res.send(token)
        })
        .catch(function (error) {
            console.log(error);
            res.send(error)
        });

})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

//gets the graphql access token
async function getToken() {
    data = JSON.stringify({
        "grant_type": "http://auth0.com/oauth/grant-type/password-realm",
        "realm": "Machine-Authentication",
        "client_id": "vqvoRIBjwI3BuDNhN0EjqTbnaiDJfuAt",
        "username": "4f00f7403145435ebd49a8ac68331fd5",
        "password": "gzimnigsoqzffjiwmpebjv^jzbcmoiaarsxzvkgwikiezsrsqJwwbbddrvwfzfjf"
    })
    var config = {
        method: 'post',
        url: 'https://auth.cliprai.dev/oauth/token/',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'did=s%3Av0%3A1eb95820-c3cc-11eb-b2f1-73efa82324fd.grmuchFntNCamg3YaUqvMKLvBoF58pSkkzes2%2Fp62ZI; did_compat=s%3Av0%3A1eb95820-c3cc-11eb-b2f1-73efa82324fd.grmuchFntNCamg3YaUqvMKLvBoF58pSkkzes2%2Fp62ZI'
        },
        data: data
    };
    tokenData = await axios(config)
    return tokenData
}