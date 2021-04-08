const container = i('stuff-goes-here-lol');
const random = generateRandomString();
const optionsMap = {
    'type': {
        'kart': ['Kart','fa-car'],
        'suit': ['Suit', 'fa-tshirt'],
        'heatbar': ['Heatbar', 'fa-fire'],
        'sound': ['Sound', 'fa-volume-up'],
        'helmet': ['Helmet', 'fa-hard-hat'],
        'other': ['Other', 'fa-file-alt'],
        'none': ['Type', 'fa-chevron-down']
    },
    'author': {
        'hellpest': ['Hellpest','fa-user'],
        'nightlibra': ['nightlibra', 'fa-user'],
        'darkius': ['Darkius', 'fa-user'],
        'cosmictailz': ['CosmicTailz', 'fa-user'],
        'paleodraw': ['Paleodraw','fa-user'],
        'none': ['Author', 'fa-chevron-down']
    }
}
let containerInnerHTML = '';
let peopleJSON, resourcePacksJSON;
let filters = {
    'author': 'none',
    'type': 'none'
}

async function grabJSONs() {
    await fetch(`json/people.json?r=${random}`).then(r=>r.json()).then(r=>peopleJSON = r);
    await fetch(`json/resource-packs.json?r=${random}`).then(r=>r.json()).then(r=>resourcePacksJSON = r);
    displayPacks(resourcePacksJSON.reverse()); // Show the newly added ones first I guess xD
}

async function displayPacks(packs) {
    // packs is an filtered array of objects from resourcePacksJSON
    containerInnerHTML = '';
    if (packs.length) {
        packs.forEach(pack=>{
            const person = peopleJSON[pack.author];
            const imageBackground = pack.background ? `images/resource-packs/${pack.background}` : 'images/placeholder.png';
            const personAvatar = person.avatar ? `images/avatars/${person.avatar}` : 'images/placeholder.png';
            let downloadsHTML = '';
            let tagsHTML = '';
            Object.keys(pack.downloads).forEach(version=>{
                downloadsHTML += `<a href="${pack.downloads[version]}" class="option" target="_blank">${version} <i class="fas fa-external-link-square-alt"></i></a>`;
            });
            pack.tags.forEach(tag=>{
                tagsHTML += `<span class="tag"><i class="fas ${optionsMap.type[tag][1]}"></i> ${optionsMap.type[tag][0]}</span>`;
            });
            containerInnerHTML += `
            <div class="card-block resource-pack">
                <div class="image-area">
                    <div class="image-container">
                        <img src="${imageBackground}" class="card-image" />
                    </div>
                    <div class="pack-summary">${pack.description}</div>
                    <a href="${pack.informationLink}" class="forum-link" target="_blank"><i class="fas fa-info-circle"></i> <span class="popup-text">View More information</span></a>
                </div>
                <div class="description">
                    <div class="description-tags">
                        ${tagsHTML}
                    </div>
                    <div class="description-inner">
                        <img src="${personAvatar}" class="avatar">
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
                </div>
            </div>`;
        });
    } else {
        containerInnerHTML = '<p class="no-packs">No resource packs match this filter</p>';
    }
    container.innerHTML = containerInnerHTML; // Instead of adding each pack individually, I store all the HTML in one string (containerInnerHTML) and then add it all at once, and it seems to be significantly faster.
}

async function applyFilters(authorName,type) {
    let authorFiltered = [...resourcePacksJSON];
    let filtered = [...resourcePacksJSON];
    if (authorName !== 'none') {
        authorFiltered = resourcePacksJSON.filter(pack=>{
            //debugger;
            return peopleJSON[pack.author].username.toLowerCase() === authorName;
        });
    }
    if (type !== 'none') {
        filtered = authorFiltered.filter(pack=>pack.tags.indexOf(type) >= 0);
    } else {
        filtered = authorFiltered;
    }
    /*const filtered = authorFiltered.filter(pack1=>{
        return typeFiltered.filter(pack2=>pack1.id === pack2.id);
    });*/
    //debugger;
    return filtered;
};

document.body.addEventListener('click',async e=>{
    if (e.target.matches('[data-option]')) {
        //debugger;
        const pickedHTML = e.target.parentElement.previousElementSibling;
        const choice = e.target.getAttribute('data-option');
        const optionType = e.target.getAttribute('data-for');
        filters[optionType] = choice;
        pickedHTML.innerHTML = `${optionsMap[optionType][choice][0]} <i class="fas ${optionsMap[optionType][choice][1]}"></i>`;
        const filteredPacks = await applyFilters(filters.author,filters.type);
        await displayPacks(filteredPacks);
        console.log(e.target.getAttribute('data-option'));
    }
});

grabJSONs();
