const express = require('express'),
    cluster = require('cluster'),
    fs = require('fs'),
    path = require('path'),
    env = require('./config/environment.js'),
    src = process.argv.slice(-1)[0],
    app = express(),
    compression = require('compression');

if (env.isProduction && cluster.isMaster) {
    for (var i = 0; i < env.numCPUs; i++)
        cluster.fork();

    cluster.on('listening', function (worker) { console.log(worker.id); });

    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });
} else {
    app.use(compression());
    app.set(src, path.join(__dirname, src));
    app.use(express.static(path.join(__dirname, src)));

    app.get('/*', function (req, res) {
        res.setHeader("Content-Type", "text/html");
        fs.readFile(`./${src}/index.html`, 'utf8', function (err, text) {
            if (err) throw err;
            res.send(text);
        });
    });

    app.listen(env.port, function () {
        console.log('Aplicação rodando na porta:' + env.port);
    });
}
