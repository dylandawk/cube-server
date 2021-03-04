const express = require("express");
const port = process.env.PORT || 8080;
const app = express();

//  run webpack in dev mode
if(process.env.NODE_ENV === "development"){
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const config = require ('./webpack.dev.config.js');
    const compiler = webpack(config);

    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    }));
}

app.use(express.static('public'));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/app/index.html');
});

const listener = app.listen(port, function(){
    console.log('Your app is listening on port: ' + port);
});