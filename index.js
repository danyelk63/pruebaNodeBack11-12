const express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();


//Devuelve una lista de productos al admin
router.get('/productos', function(req, res) {
    if(req.headers.auth == "admin"){
        res.send(require("./data/productos.json"));
    }
    else {
        res.status(401);
        res.send("No tiene autorización")
    }
});

app.use(router);

app.listen(3000, function() {
  console.log("Node server running on http://localhost:3000");
});