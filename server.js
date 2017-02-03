var express = require('express')
var app = express()
var stream = require('stream')
var x = require('x-ray')()

app.get('/price', function(req, res) {
    var p = x('https://www.ligamagic.com.br/?view=cards/card&card=' + encodeURIComponent(req.query.card), '.precos')(function (err, precos) {
        if (err) console.log(err)
        
        if (!precos) {
            res.status(404).send('not found')
        }

        var p = precos.trim().split('\n')
        var obj = {
            'Low': p[0].trim(),
            'Avg': p[1].trim(),
            'High': p[2].trim()
        };
        res.send(JSON.stringify(obj))
    })
})

var port = 3000
app.listen(port, function () {
    console.log('it\'s alive: ' + port)
});

