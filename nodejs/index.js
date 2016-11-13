var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
app.use(fileUpload());
var bodyParser = require('body-parser')
app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
var fs = require('fs');
var uploadHtml;
var downloadHtml;
fs.readFile('../frontend/upload.html', 'utf8', function(err, html) {
    if (err) {
        console.log(err);
    }
    uploadHtml = html;
});
fs.readFile('../frontend/download.html', 'utf8', function(err, html) {
    if (err) {
        console.log(err);
    }
    downloadHtml = html;
});
app.post('/upload', function (req, res) {
    if (!req.files) {
        res.send({
            type: "FileError",
            message: "No file found"
        })
        return;
    }
    let download = 1;
    let link = "";
    if (req.body.download) {
        download = req.body.download
    }
    if (req.body.link) {
        link = req.body.link;
    }
    var file = req.files.file;
    file.mv('filestore/' + file.name, function(err) {
        if (err) {
            console.log(err);
            res.send({
                type: "FileError",
                message: "There was a problem uploading the file. Please try again later."
            });
        }
        res.send({
            type: "Success",
            message: "fileid"
        });
    });
});

app.get('/download', function(req, res) {
    res.send(downloadHtml);
});
app.get('/', function(req, res) {
    res.send(uploadHtml)
});

app.use(express.static('../frontend'));

app.listen(3000, function () {
  console.log('Test app listening on port 3000!');
});
