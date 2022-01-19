let leaderboardIncrement = 1;

async function generateLeaderboard() {
    if (!playerData) {
        await loadPlayerData();
    }
    addElementsToContainer(id('leaderboard-container'),[...playerData.golds].splice(0,10),formatLeaderboardEntry);
}
function formatLeaderboardEntry(entry) {
    return `
    <div class="player">
        <div class="left-info">
            <span class="position">#${leaderboardIncrement++}</span>
            <span class="username" data-username="${entry.displayName}">${entry.displayName}</span>
        </div>
        <div class="right-info">
            <span class="golds">${entry.gold_trophy}<i class="fas fa-ribbon"></i></span>
        </div>
    </div>
    `
}

generateLeaderboard();
