var express = require('express')
var app = express()
var cors = require('cors')
var stream = require('stream')
var x = require('x-ray')()
var port = process.env.PORT || 3000;

app.use(cors())

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('mehh')
})

app.get("/", function(req, res) {
    res.send('not the droids you\'re looking for')
});

app.get('/price', function(req, res) {
    var p = x('https://www.ligamagic.com.br/?view=cards/card&card=' + encodeURIComponent(req.query.card), '.precos')(function (err, prices) {
        if (err) console.log(err)
        
        if (!prices) {
            res.status(404).send('not found')
        }

        var p = prices.trim().split('\n')
        var obj = {
            'Low': p[0].trim(),
            'Avg': p[1].trim(),
            'High': p[2].trim()
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(obj))
    })
})

app.listen(port, function () {
    console.log('it\'s alive: ' + port)
});

