const express = require("express")
const port = 6900 ;
const app = express();
const indexRouter = require("./route")
const path = require('path')
require("./middleware/mongoConnect")

app.use('/css', express.static('node_modules/bootstrap/dist/css'))
app.use('/js', express.static('node_modules/bootstrap/dist/js'))
app.use('/js', express.static('node_modules/jquery/dist'))

app.set("views", ("./views"));
app.set("view engine", "ejs");
app.use("/", indexRouter);

app.listen(port, (err) => {
    if(err){
        console.log(`Error `, err);
        return
    }
    console.log(`Server started on ${port}`);
});