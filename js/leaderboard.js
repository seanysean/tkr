let leaderboardIncrement = 3;

const optionsMap = {
    'gold_trophy': ['Golds','fa-trophy', 'golds'],
    'coins': ['Coins', 'fa-coins', 'coins']
}

async function displayLeaderBoard(inputdata,key='gold_trophy') {
    leaderboardIncrement = 3;
    const data = [...inputdata]; // don't modify the arguments~!!!!
    $('.top-3')[0].innerHTML = `<div class="second-place">
    <div class="placement-circle">
        <span>#2</span>
    </div>
    <div class="username" data-username="${data[1].displayName}">${data[1].displayName}</div>
    <div class="points">${data[1][key]} ${optionsMap[key][2]}</div>
</div>
<div class="first-place">
    <div class="placement-circle">
        <span>#1</span>
    </div>
    <div class="username" data-username="${data[0].displayName}">${data[0].displayName}</div>
    <div class="points">${data[0][key]} ${optionsMap[key][2]}</div>
</div>
<div class="third-place">
    <div class="placement-circle">
        <span>#3</span>
    </div>
    <div class="username" data-username="${data[2].displayName}">${data[2].displayName}</div>
    <div class="points">${data[2][key]} ${optionsMap[key][2]}</div>
</div>`;
    function format3rdOnwards(leader) {
        return `<div class="leader"><div class="place">#${++leaderboardIncrement}</div><div class="username-storage"><div class="username" data-username="${leader.displayName}">${leader.displayName}</div></div><div class="points">${leader[key]} ${optionsMap[key][2]}</div></div>`;
    }
    addElementsToContainer($('.rest-of-the-leaderboard-lol')[0],data.splice(3,97),format3rdOnwards);
}

async function downloadDataIfNeeded() {
    if (!playerData) {
        await loadPlayerData();
    }
    displayLeaderBoard(playerData.golds);
}

async function sortData(sortKey) {
    if (sortKey === 'gold_trophy') {
        return playerData.golds;
    }
    const sortedData = [...playerData.golds];
    sortedData.sort((a,b)=>{
        return b[sortKey] - a[sortKey];
    });
    return sortedData;
}

document.body.addEventListener('click',async e=>{
    if (e.target.matches('[data-option]')) {
        //debugger;
        const pickedHTML = e.target.parentElement.previousElementSibling;
        const choice = e.target.getAttribute('data-option');
        pickedHTML.innerHTML = `${optionsMap[choice][0]} <i class="fas ${optionsMap[choice][1]}"></i>`;
        const sortedLeaderboardData = await sortData(choice);
        await displayLeaderBoard(sortedLeaderboardData,choice);
        console.log(e.target.getAttribute('data-option'));
    }
});

downloadDataIfNeeded();
