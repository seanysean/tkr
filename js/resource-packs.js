const container = i('stuff-goes-here-lol');
let peopleJSON, resourcePacksJSON;
fetch('/json/people.json').then(r=>r.json()).then(r=>peopleJSON = r);
fetch('/json/resource-packs.json').then(r=>r.json()).then(r=>resourcePacksJSON = r);

function displayPacks(packs) {
    // packs is an array from the resourcePacksJSON objects
    container.innerHTML = '';
    packs.forEach(pack=>{
        const person = peopleJSON[pack.author];
        let downloadsHTML = '';
        Object.keys(pack.downloads).forEach(version=>{
            downloadsHTML += `<a href="${pack.downloads[version]}" class="option" target="_blank">${version} <i class="fas fa-external-link-square-alt"></i></a>`;
        });
        container.innerHTML += `
        <div class="card-block resource-pack">
            <div class="image-area">
                <div class="image-container">
                    <img src="images/resource-packs/${pack.background}" class="card-image" />
                </div>
                <div class="pack-summary">${pack.description}</div>
                <a href="${pack.informationLink}" class="forum-link" target="_blank"><i class="fas fa-info-circle"></i> <span class="popup-text">View More information</span></a>
            </div>
            <div class="description">
                <img src="images/avatars/${person.avatar}" class="avatar">
                <div class="infos">
                    <div class="title">${pack.name}</div>
                    <div class="author">${person.username}</div>
                    <div class="download dropdown">
                        <div class="dropdown-picked">Download <i class="fas fa-chevron-down"></i></div>
                        <div class="dropdown-options">
                            ${downloadsHTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
}
