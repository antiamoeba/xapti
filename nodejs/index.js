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
var handlebars = require('handlebars');
var uploadHtml;
var downloadTemplate;
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
    downloadTemplate = handlebars.compile(html);
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/xapti');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    var fileSchema = new mongoose.Schema({
        filename: String,
        linkUrl: String,
        downloads: Number,
        time: Date,
        uploaded: Date
    });
    var File = mongoose.model('File', fileSchema);

    app.post('/upload', function (req, res) {
        if (!req.files) {
            return res.send({
                type: "FileError",
                message: "No file found!"
            })
        }
        let download = 1;
        let hours = 24;
        let link = "";
        if (req.body.download) {
            download = req.body.download;
        }
        if (req.body.hours) {
            hours = req.body.hours;
        }
        if (req.body.link) {
            link = req.body.link;
        }
        File.findOne({linkUrl: link}, function(err, oldfile) {
            if (err) {
                console.log(err);
                return res.send({
                    type: "FileError",
                    message: "There was a problem uploading the file. Please try again later."
                });
            }
            if (oldfile) {
                return res.send({
                    type: "FileError",
                    message: "File already exists!"
                });
            }
            var date = new Date(Date.now() + hours*3600000);
            var file = req.files.file;
            var fileObj = new File({
                filename: file.name,
                linkUrl: link,
                downloads: download,
                time: date,
                uploaded: Date.now()
            });
            fileObj.save(function(err, fileObj) {
                if (err) {
                    console.log(err);
                    return res.send({
                        type: "FileError",
                        message: "There was a problem uploading the file. Please try again later."
                    });
                }
                file.mv('filestore/' + fileObj._id, function(err) {
                    if (err) {
                        console.log(err);
                        return res.send({
                            type: "FileError",
                            message: "There was a problem uploading the file. Please try again later."
                        });
                    }
                    return res.send({
                        type: "Success",
                        message: "/download/" + link
                    });
                });
            });
        });
    });

    app.get('/download/:link', function(req, res) {
        File.findOne({linkUrl: req.params.link}, function(err, file) {
            if (err) {
                return res.send({
                    type: "FileError",
                    message: "There was a problem finding the file. Please try again later."
                });
            }
            if (!file) {
                return res.send({
                    type: "FileError",
                    message: "There was a problem finding the file. Please try again later."
                });
            }
            res.send(downloadTemplate({
                id: file._id,
                uploaded: file.uploaded,
                expires: file.time,
                filename: file.filename,
                downloads: file.downloads
            }));
        });
    });
    app.get('/file/:id', function(req, res) {
        File.findById(req.params.id, function(err, file) {
            if (err) {
                return res.send({
                    type: "FileError",
                    message: "There was a problem finding the file. Please try again later."
                });
            }
            if (!file) {
                return res.send({
                    type: "FileError",
                    message: "There was a problem finding the file. Please try again later."
                });
            }
            var expirDate = file.time;
            var filePath = __dirname + '/filestore/' + file._id;
            if (Date.now() > expirDate.getTime()) {
                fs.unlink(filePath, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                file.remove();
                console.log("here!");
                return res.send({
                    type: "FileError",
                    message: "There was a problem finding the file. Please try again later."
                });
            }
            res.download(filePath, file.filename, function(err) {
                if (err) {
                    console.log(err);
                }
                file.downloads = file.downloads - 1;
                if (file.downloads <= 0) {
                    fs.unlink(filePath, function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    file.remove();
                } else {
                    file.save(function(err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        
        });
    });

    app.get('/', function(req, res) {
        res.send(uploadHtml)
    });

    app.use(express.static('../frontend'));

    app.listen(3000, function () {
        console.log('Xapti listening on port 3000!');
    });
});
