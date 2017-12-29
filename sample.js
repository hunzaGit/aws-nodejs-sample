// Load the SDK and UUID
var AWS = require('aws-sdk');
var fs = require('fs');

//var s3 = require('aws-sdk/clients/s3');

// Create a bucket and upload something into it
var bucketName = 'pruebabucketpublicos3';
var keyName = 'pruebaSobreescritura';
var AWSService = 's3',
    region = 'eu-west-1',
    host = 'amazonaws.com';


AWS.config.update({
    region: region,
    /*credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })*/
});

// Create an S3 client
var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: bucketName}
});



//ListarAlbums
//listAlbums();

//crear un album (directorio)
//createAlbum('nuevaConfig');

//Añadir un objeto a un album
addPhoto('perro.js','nuevaConfig');

/*
    ["obj1", "obj2", "obj3", "obj4", "obj5", "obj6", "obj7", "obj8",]
        .forEach(elem => {
            addPhoto(elem, 'nuevaConfig');
        });
*/

//viewAlbum('nuevaConfig');




function listAlbums() {
    s3.listObjects({Delimiter: '/'}, function (err, data) {
        if (err) {
            return alert('There was an error listing your albums: ' + err.message);
        } else {
            console.log(data);

            data.CommonPrefixes
                .map(function (commonPrefix) {
                    var prefix = commonPrefix.Prefix;
                    var albumName = decodeURIComponent(prefix.replace('/', ''));
                    return albumName;
                })
                .forEach(album => {
                    console.log(album);
                });

        }
    });
}


//s3.createBucket({Bucket: bucketName}, function() {
//});

function crearObjeto() {

    var params = {
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

            var URL_FILE = 'https://' + AWSService + '-' + region + '.' + host + '/' + bucketName + '/' + keyName;
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
        Key: albumKey
    }, function (err, data) {

        if (!err) {
            return console.log('Album already exists.');
        }
        if (err.code !== 'NotFound') {
            return console.log('There was an error creating your album: ' + err.message);
        }

        //Insertar album
        s3.putObject({
           Key: albumKey
        }, function (err, data) {

            if (err) {
                return console.log('There was an error creating your album: ' + err.message);
            }
            console.log('Successfully created album.');
            //var URL_FILE = 'https://' + AWSService + '-' + region + '.' + host + '/' + bucketName + '/' + albumKey;
            //console.log('URL: ' + URL_FILE);
        });
    });
}


function addPhoto(fileName, albumName) {
    //var bodyFile = "cuerpo del fichero version 2";
    var bodyFile = fs.readFileSync(fileName);
    console.log(bodyFile);

    console.log(bodyFile.type);

    if (!bodyFile.length) {
        return console.log('Please choose a file to upload first.');
    }

    var albumPhotosKey = encodeURIComponent(albumName) + '/';

    var photoKey = albumPhotosKey + fileName;

    var time1 = new Date().getTime();
    s3.upload({
        Key: photoKey,
        Body: bodyFile,
        ACL: 'public-read'
    }, function (err, data) {
        if (err) {
            return console.log('There was an error uploading your photo: ', err.message);
        }
        console.log(data);
        console.log(data.Bucket)
        console.log(data.Key);
        //console.log('Successfully uploaded photo.');
        var URL_FILE = 'https://' + AWSService + '-' + region + '.' + host + '/' + bucketName + '/' + photoKey;
        console.log('URL1: ' + URL_FILE);

        var URL_FILE2 = data.Location;
        console.log('URL2: ' + URL_FILE2);

        var time2 = new Date().getTime();
        console.log((time2-time1)/1000 + 'seg');
    });

}

function viewAlbum(albumName) {
    var albumPhotosKey = encodeURIComponent(albumName) + '/';
    s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
        if (err) {
            return alert('There was an error viewing your album: ' + err.message);
        }
        // `this` references the AWS.Response instance that represents the response
        var href = this.request.httpRequest.endpoint.href;
        var bucketUrl = href + bucketName + '/';

        console.log(data);
        data.Contents
            .map(function(photo) {
                var photoKey = photo.Key;
                var photoUrl = bucketUrl + encodeURIComponent(photoKey);
                return photoUrl;
            })
            .forEach((photo)=>{
                console.log(photo);
            });

        console.log('bucketURL: '+ bucketUrl);


    });
}

function deletePhoto(albumName, photoKey) {
    s3.deleteObject({Key: photoKey}, function(err, data) {
        if (err) {
            return alert('There was an error deleting your photo: ', err.message);
        }
        alert('Successfully deleted photo.');
        viewAlbum(albumName);
    });
}



