let leaderboardIncrement = 1;

async function loadData() {
    let leaderboardJson = await getJson(`${apiRoot}/get_json.php?data=leaderboard`,true);
    // $('.loading-message').forEach(el=>{
    //     el.style.display = 'none';
    // });
    addElementsToContainer(id('leaderboard-container'),leaderboardJson.golds.splice(0,10),formatLeaderboardEntry);
    if (checkForUpdate(leaderboardJson.lastUpdated)) {
        alert('plz');
        const newStuff = await getJson(`${apiRoot}/update.php?api=hypixel`,true);
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
}

function formatLeaderboardEntry(entry) {
    return `
    <div class="player">
        <div class="left-info">
            <span class="position">#${leaderboardIncrement++}</span>
            <span class="username mvpblue">${entry.displayName}</span>
        </div>
        <div class="right-info">
            <span class="golds">${entry.gold_trophy}<i class="fas fa-ribbon"></i></span>
        </div>
    </div>
    `
}

loadData();
