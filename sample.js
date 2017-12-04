// Load the SDK and UUID
var AWS = require('aws-sdk');
// Create an S3 client
var s3 = new AWS.S3();

// Create a bucket and upload something into it
var bucketName = 'pruebabucketpublicos3';
var keyName = 'pruebaPublicaURL3.txt';
var AWSService = 's3',
    region = 'eu-west-1',
    host = 'amazonaws.com';







//crear un album (directorio)
createAlbum('59987e91b15f750950246e96');

//Añadir un objeto a un album
addPhoto('59987e91b15f750950246e96');


//s3.createBucket({Bucket: bucketName}, function() {
//});

function crearObjeto () {

    var params = {
        Bucket: bucketName,
        Key: keyName,
        Body: 'prueba para ver la URL publica',
        ACL: 'public-read'
    };

    s3.putObject(params, function (err, data) {
        if (err)
            console.log(err)
        else {
            console.log(data);
            console.log("Successfully uploaded data to " + bucketName + "/" + keyName);

            var URL_FILE = 'https://' + AWSService + '-' + region +'.'+ host + '/' + bucketName +'/'+ keyName;
            console.log('URL: ' + URL_FILE);
        }
    });

}

//});



function createAlbum(albumName) {
    albumName = albumName.trim();
    if (!albumName) {
        return console.log('Album names must contain at least one non-space character.');
    }
    if (albumName.indexOf('/') !== -1) {
        return console.log('Album names cannot contain slashes.');
    }
    var albumKey = encodeURIComponent(albumName) + '/';

    //comprobar si el directorio existe y si es correcto
    s3.headObject({
        Bucket: bucketName,
        Key: albumKey
    }, function(err, data) {

        if (!err) {
            return console.log('Album already exists.');
        }
        if (err.code !== 'NotFound') {
            return console.log('There was an error creating your album: ' + err.message);
        }

        //Insertar album
        s3.putObject({
            Bucket: bucketName,
            Key: albumKey
        }, function(err, data) {

            if (err) {
                return console.log('There was an error creating your album: ' + err.message);
            }
            console.log('Successfully created album.');
            var URL_FILE = 'https://' + AWSService + '-' + region +'.'+ host + '/' + bucketName +'/'+ albumKey;
            console.log('URL: ' + URL_FILE);
        });
    });
}


function addPhoto(albumName) {
    var file = "cuerpo de la foto";
    /*var files = document.getElementById('photoupload').files;
    if (!files.length) {
        return console.log('Please choose a file to upload first.');
    }
    var file = files[0];
    var fileName = file.name;
    */
    var albumPhotosKey = encodeURIComponent(albumName) + '/';

    var photoKey = albumPhotosKey + keyName;
    s3.upload({
        Bucket: bucketName,
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
    }, function(err, data) {
        if (err) {
            return console.log('There was an error uploading your photo: ', err.message);
        }
        console.log('Successfully uploaded photo.');
        var URL_FILE = 'https://' + AWSService + '-' + region +'.'+ host + '/' + bucketName +'/' + albumName+ '/'+ keyName;
        console.log('URL: ' + URL_FILE);
    });
}