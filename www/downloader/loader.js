fetch('api/data').then(d => d.json()).then(data => {
    console.log(data)

    var holder = GetFileHolder();

    for (var file of data.Files) {
        holder.appendChild(CreateElement(file));
    }
});

function CreateElement(fileProperties) {
    var elementContainer = document.createElement('div');
    elementContainer.style.textAlign = 'center';
    elementContainer.style.float = 'left';
    elementContainer.style.margin = '10px'
    elementContainer.style.padding = '5px'
    elementContainer.style.border = 'solid black'

    elementContainer.className = 'element-container';

    var icon = document.createElement('img');
    icon.src = `/api/icons/${fileProperties.Icon}`
    icon.style.maxWidth = '100%';
    icon.style.maxHeight = '100%';

    var title = document.createElement('h3');
    title.innerHTML = fileProperties.Name;
    title.style.wordBreak = 'break-all';

    elementContainer.appendChild(icon);
    elementContainer.appendChild(title);

    if (!fileProperties.IsDirectory) {
        var downloadButton = document.createElement('button')
        downloadButton.className = 'download-button regular-text';
        downloadButton.innerHTML = 'Download';
        downloadButton.onclick = () => {
            DownloadFile(fileProperties.Name);
        };
        elementContainer.appendChild(downloadButton);
    } else {
        var stepIntoButton = document.createElement('button')
        stepIntoButton.className = 'stepinto-button regular-text';
        stepIntoButton.innerHTML = 'Step into';

        elementContainer.appendChild(stepIntoButton);
    }


    return elementContainer;
}

function DownloadFile(fileName) {
    //will change from name to path when supporting navigation in directories
    //fetch(`/api/download?name=${fileName}`)
    window.location.href = `/api/download?name=${fileName}`;
}

function GetFileHolder() {
    return document.getElementById('fileHolderId');
}