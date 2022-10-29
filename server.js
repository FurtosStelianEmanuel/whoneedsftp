const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const Enumerable = require('node-enumerable');

const DownloadFolder = 'download';
const FolderIcon = 'Folder.png';
const IconsFolder = 'icons';
const GitIgnoreFile = '.gitignore';

const IconNames = GetIconNames();

app.get('/download', (req, res) => {
    SendFile('www/downloader/index.html', res);
})

app.get('/loader.js', (req, res) => {
    SendFile('www/downloader/loader.js', res);
})

app.get('/api/data', (req, res) => {
    var files = fs.readdirSync(DownloadFolder, { withFileTypes: true });
    files = Enumerable.from(files).where(f => f.name !== GitIgnoreFile).toArray();

    var data = {
        Files: files.map(function (f) {
            var stats = GetStatsOfFileInDownloadFolder(f);

            return {
                Name: f.name,
                Icon: GetIconForFileOrFolder(f),
                IsDirectory: f.isDirectory(),
                Size: GetSizeOfFileFromStats(stats),
                DateCreated: stats.birthtime,
                LastAccessed: stats.atime,
                LastModified: stats.mtime,
                LastMetadataChange: stats.ctime
            }
        }),
    };

    res.send(data);
})

app.get('/api/icons/*', (req, res) => {
    var splittedUrl = req.url.split('/');
    console.log(splittedUrl);
    var iconName = splittedUrl[splittedUrl.length - 1];

    SendFile(`icons/${iconName}`, res);
})

app.get('/api/download', (req, res) => {
    //will change from name to path when supporting navigation in directories
    var name = req.query.name;

    DownloadFile(name, res);
})

var IconCounter = 0;

function GetIconForFileOrFolder(file) {
    return file.isDirectory() ? FolderIcon : IconNames[(IconCounter++) % IconNames.length];
}

function GetSizeOfFileFromStats(stats) {
    var fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    return {
        InBytes: fileSizeInBytes,
        InMegaBytes: fileSizeInMegabytes
    };
}

function GetStatsOfFileInDownloadFolder(file) {
    var stats = fs.statSync(path.join(__dirname, DownloadFolder, file.name));

    return stats;
}

function SendFile(fileName, res) {
    var options = {
        root: path.join(__dirname)
    };

    res.sendFile(fileName, options, function (err) {
    });
}

function DownloadFile(fileName, res) {
    res.download(path.join(__dirname, DownloadFolder, fileName));
}

function GetIconNames() {
    var files = fs.readdirSync(path.join(__dirname, IconsFolder), { withFileTypes: true });

    return Enumerable.from(files).where(f => f.name !== FolderIcon && !f.isDirectory() && (f.name.endsWith('.jpg') || f.name.endsWith('.png'))).select(s => s.name).toArray();
}

function GetRandomNumber(upperLimit) {
    return Math.floor(Math.random() * upperLimit);;
}

app.listen(9000);