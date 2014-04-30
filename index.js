#!/usr/bin/env node

var JSZip = require('jszip');
var fs = require('fs');
var zip = new JSZip();

var wtd = function(){
    //write to disk
    var file = zip.generate({type:'nodebuffer'});
    fs.writeFile('app.nw', file, function(err){
        if (err)
            throw err;
    }); 
}


var getName = function(dir){
    return dir.replace(G.path+'/', '');
}

var getFile = function(dir){
    console.log(getName(dir))
    fs.readFile(dir, function(err, data){
        if (err) throw err;

        addFile(getName(dir), data);
    });
}

var getDir = function(path){
    console.log(getName(path))
    fs.readdir(path, function(err, files){
        if (err) throw err;

        G.length += files.length;
        fileLoop(files, path);
    })
}

var addFile = function(fileName, data){
    zip.file(fileName, data);
    --G.length === 0 && wtd();
}

var addDirectory = function(folderName){
    zip.folder(folderName);
    --G.length === 0 && wtd();
}

var fileLoop = function(files, path){
    files.forEach(function(fileName){
        var dir = path + '/' + fileName;
        fs.lstat(dir, function(err, stats){
            if (err) throw err;

            if (stats.isFile()) {
                getFile(dir);
            }
            else if (stats.isDirectory()){
                addDirectory(getName(dir));
                getDir(dir)
            }
        });
    });    
}


var main = function(){
    var path = G.path;

    fs.lstat(path, function(err, stats){
        if (err) throw err;

        if (stats.isFile()) {
            G.length = 1;
            getFile(path);
        }
        else if (stats.isDirectory()){
            getDir(path)
        }
    });
};


var args = process.argv.slice(2);
var G = {
    cmd: args[0],
    path: args[1] || '.',
    length: 0
};
switch (G.cmd){
    case 'zip':
        main();break;
    default :
        console.log('\n\tzip2nw zip');
}

module.exports = main;

