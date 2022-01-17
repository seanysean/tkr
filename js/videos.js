const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];

async function loadData() {
    const videosJson = await getJson(`${apiRoot}/get_json.php?data=videos`,true);
    console.log(videosJson);
    $('.loading-message').forEach(el=>{
        el.style.display = 'none';
    });
    if (checkForUpdate(videosJson.lastUpdated)) {
        const newStuff = await getJson(`${apiRoot}/update.php?api=youtube`,true);
        if (newStuff.success) {
            //alert('Updated information available! Reload to apply changes.');
            document.body.innerHTML += `<div id="new-stuff-alert" class="toast">
            <div class="message">Updated information is available</div>
            <div class="options">
                <div id="reload-button" class="button">Reload</div>
                <div id="dismiss-button" class="button">Dismiss</div>
            </div>
            </div>`;
            const t = document.querySelector('.toast');
            t.style.display = 'block';
            setTimeout(()=>{
                t.style.opacity = 1;
                t.style.bottom = '10px';
            },300)
        }
        console.log(JSON.stringify(newStuff));
    }
    addElementsToContainer(id('tutorial-section'),videosJson.tutorials,formatVideo);
    addElementsToContainer(id('neoh-section'),videosJson.neohPlaylist.reverse(),formatVideo); // reversed so that the newest are shown first
    addElementsToContainer(id('recent-section'),getMostRecentVideos(videosJson.recent),formatVideo);
}

function formatVideo(data) {
    return `<a class="video" href="https://www.youtube.com/watch?v=${data.videoID}" target="_blank">
            <div class="thumbnail">
                <div class="duration">${formatVideoLength(data.length)}</div>
                <img src="${data.thumbnail}">
            </div>
            <div class="info">
                <div class="title" title="${data.title}">${data.title}</div>
                <div class="meta">${data.views} Views | Uploaded on ${formatTimestamp(data.uploadTimestamp)}</div>
                <div class="author">${data.author}</div>
            </div>
            <i class="fas fa-external-link-square-alt external"></i>
        </a>`;
}

function formatTimestamp(timestamp) {
    const time = new Date(timestamp * 1000); // Looks like google timestamps are stored in seconds instead of milliseconds
    return `${months[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`;
}

function formatVideoLength(youtubeWeirdVideoLengthString) {
    const times = youtubeWeirdVideoLengthString.match(/\d+/g);
    /*const timesWithUnits = [];
    const units = ['sec','min','hr'];
    times.forEach((timeInt,index) => {
        timesWithUnits.push(' ' + timeInt + units[index]);
    });*/
    let output = '';
    if (times.length > 1) {
        times.forEach((timeInt,index) => {
            if (index !== 0) { // We don't want a result such as 5:9 or 1:3:01, so we add a 0 to hopefully make 5:09 and 1:03:01 respectively
                timeInt = timeInt.length === 2 ? timeInt : '0' + timeInt;
            }
            output += timeInt + ':';
        });
    } else {
        let timeInt = times[0];
        timeInt = timeInt.length === 2 ? timeInt : '0' + timeInt;
        output = '0:' + timeInt + ':'; //add the : at the end to remain consistent and so that the substring doesn't clip the number
    }
    
    output = output.substring(0,output.length - 1); // remove the final :
    // console.log(output + '------' + youtubeWeirdVideoLengthString);
    return output;
}

function getMostRecentVideos(videosArray) {
    console.log(videosArray);
    videosArray.sort((a,b)=> b.uploadTimestamp - a.uploadTimestamp);
    return videosArray.slice(0,5); // get 5 most recent
}

loadData();
