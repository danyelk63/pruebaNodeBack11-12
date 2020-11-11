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
//Almacena toda la lista de cupones
var listaCupones = require("./data/cupones.json");


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

//Añade un cupon nuevo solo puede acceder el admin
router.post('/cupones/crear', function(req, res) {
    if(req.headers.auth == "admin"){
        if(req.body.product_id < listaProductos.length && req.body.product_id >= 0){

            var fs = require("fs")

            req.body.id = listaCupones.length;
            listaCupones.push(req.body);
            fs.writeFile("./data/cupones.json", JSON.stringify(listaCupones), "utf8", function(err){
                if(err) throw err;
              });
            res.send(req.body);
        }
        else {
            res.status(500)
            res.send("El id no existe")
        }
    }
    else {
        res.status(401);
        res.send("No tiene autorización")
    }
});

//Devuelve una lista de cupones al admin
router.get('/cupones', function(req, res) {
    if(req.headers.auth == "admin"){
        res.send(listaCupones);
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



//Devuelve un producto especifico al admin
router.get('/cupones/:id', function(req, res) {
    if(req.headers.auth == "admin"){
        if(listaCupones[req.params.id] != undefined){
            res.send(listaCupones[req.params.id]);
        }
        else{
            res.status(404);
            res.send("El cupon solicitado no se encuentra")
        }
        
    }
    else if(req.headers.auth == "customer"){
        if(listaCupones[req.params.id] != undefined){

            var objCupon = listaCupones[req.params.id];

            if((new Date(listaCupones[req.params.id].valid_until).getTime() - new Date().getTime()) >= 0 && new Date().getTime() - new Date(listaCupones[req.params.id].valid_since).getTime() >= 0){
                objCupon.isValid = true;
                res.send(objCupon);
            }
            else{
                objCupon.isValid = false;
                res.send(objCupon);
            }
        }
        else{
            res.status(404);
            res.send("El cupon solicitado no se encuentra")
        }
        
    }
    else {
        res.status(401);
        res.send("No tiene autorización")
    }
});