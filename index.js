const express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

//Almacena toda la lista de productos
var listaProductos = require("./data/productos.json");


//Devuelve una lista de productos al admin
router.get('/productos', function(req, res) {
    if(req.headers.auth == "admin"){
        res.send(listaProductos);
    }
    else {
        res.status(401);
        res.send("No tiene autorización")
    }
});

//Devuelve un producto especifico al admin
router.get('/productos/:id', function(req, res) {
    if(req.headers.auth == "admin"){
        if(listaProductos[req.params.id] != undefined){
            res.send(listaProductos[req.params.id]);
        }
        else{
            res.status(404);
            res.send("El producto solicitado no se encuentra")
        }
        
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