var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../testbotnajib-20180307-1.zip');
var kuduApi = 'https://testbotnajib-20180307-1.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$testbotnajib-20180307-1';
var password = '3JYgxKblpN0QFLl5617iP9TYM1Psq4uYrixQH6ilxsX434HQrTmSYD5h9E96';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('testbotnajib-20180307-1 publish');
  } else {
    console.error('failed to publish testbotnajib-20180307-1', err);
  }
});