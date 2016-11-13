var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
app.use(fileUpload());
app.use(express.static('../frontend'));
var bodyParser = require('body-parser')
app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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

app.listen(3000, function () {
  console.log('Test app listening on port 3000!');
});
