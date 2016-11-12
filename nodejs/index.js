var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
app.use(fileUpload());
app.use(express.static('../frontend'));
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
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
    var file = req.files.file;
    file.mv('test', function(err) {
        if (err) {
            console.log(err);
            res.send({
                type: "FileError",
                message: "Problem uploading file"
            });
        }
        res.send({
            type: "Success",
            message: "Uploaded file"
        });
    });
});

app.listen(3000, function () {
  console.log('Test app listening on port 3000!');
});
