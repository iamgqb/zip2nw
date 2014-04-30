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
    return dir.replace(/\.\//, '');
}

var getFile = function(dir){
    console.log(getName(dir))
    fs.readFile(dir, function(err, data){
        if (err) throw err;

        addFile(getName(dir), data);
    });
}

var getDir = function(path){
    fs.readdir(path, function(err, files){
        if (err) throw err;

        G.length += files.length;
        fileLoop(files, path);
    })
}

var addFile = function(fileName, data){
    zip.file(fileName, data);
    wtd();
    if (--G.length === 0){
        wtd();
    }
}

var addDirectory = function(folderName){
    zip.folder(folderName);
    if (--G.length === 0){
        wtd();
    }
}

var fileLoop = function(files, path){
    files.forEach(function(fileName){
        var dir = path + '/' + fileName;
        fs.lstat(dir, function(err, stats){
            if (err) throw err;

            if (stats.isFile()) {
                // console.log(stats)
                getFile(dir);
            }
            else if (stats.isDirectory()){
                addDirectory(dir);
                getDir(dir)
            }
        });
    });    
}

var G = {};
var cwd = process.cwd();
var main = function(){
    fs.readdir('.', function(err, files){
        if (err) throw err;
        G.length = files.length;
        fileLoop(files, '.');
    });
};


var args = process.argv.slice(2);
var cmd = args[0];
switch (cmd){
    case 'zip':
        main();break;
    default :
        console.log('\tzip2nw zip');
}

module.exports = main;

