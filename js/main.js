//dropdown.style.top = el.getBoundingClientRect().top + document.documentElement.scrollTop + el.offsetHeight + 1 + 'px';
//dropdown.style.right = (document.documentElement.clientWidth - el.getBoundingClientRect().right) + 'px';
// ^ Some code for positioning an absolute element (dropdown) at the bottom of any other element (el)

const isLocal = (window.location.hostname === 'localhost');
const relativeAddressRoot = isLocal ? '/' : '/tkr/'; // Github pages adds the /tkr/ after seanysean.github.io. Thus, / doesn't work unless it is locally hosted (or I get a custom domain - which could happen)
const root = document.documentElement;
const resizeCheck = new ResizeObserver(updatePageHeight);
const msPerHour = 1000 * 60 * 60; // milliseconds per hour
const apiRoot = isLocal ? 'http://localhost:7999' : 'https://turbokartracers-backend.000webhostapp.com/';

const infoPopupEl = document.createElement('div');
infoPopupEl.classList.add('hidden','info-popup');
document.body.appendChild(infoPopupEl);

let playerData;
let currentlyOpenDropdowns = [];

async function loadPlayerData() {
    playerData = await getJson(`${apiRoot}/get_json.php?data=leaderboard`,true);
    getJson(`${apiRoot}/update.php?api=hypixel`,true);
}

function updatePageHeight() {
    let pageHeight = document.documentElement.offsetHeight;
    root.style.setProperty('--page-height',pageHeight + 'px');
}
//resizeCheck.observe(document.body);
//updatePageHeight();

function id(el) {
    return document.getElementById(el);
}
function $(el) {
    return document.querySelectorAll(el);
}

function show(el) {
    //console.log('show!');
    el.style.display = 'block';
    setTimeout(()=>{
        el.classList.add('open');
    },100)
    //debugger;
}
function close(el) {
    //console.log('close');
    el.classList.remove('open');
    setTimeout(()=>{
        el.style.display = 'none';
    },100);
    //debugger;
}

function copyTextToClipboard(text) {
    const input = document.createElement('textarea');
    input.classList.add('hidden');
    document.body.appendChild(input);
    input.value = text;
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

const headerHTML = `
<a href="${relativeAddressRoot}" class="logo">TKR</a>
<nav>
    <a href="${relativeAddressRoot}leaderboard.html" class="nav-link"><i class="fas fa-medal"></i>Leaderboards</a>
    <a href="${relativeAddressRoot}videos.html" class="nav-link"><i class="fas fa-film"></i>Videos</a>
    <a href="${relativeAddressRoot}resourcepacks.html" class="nav-link"><i class="far fa-images"></i>Resource Packs</a>
</nav>`;
const footerHTML = `
<div class="left">
    <div class="site-name">Turbo Kart Racers Fan Site</div>
    <p class="admission">This is a community project, we are not affiliated with Hypixel or Mojang.</p>
</div>
<div class="right">
    <a href="https://hypixel.net/forums/turbo-kart-racers.89/" target="_blank">Hypixel Forums</a>
    <a href="https://github.com/seanysean/tkr" target="_blank">Github</a>
    <a href="https://discord.gg/DSgDTPk" target="_blank">Discord</a>
</div>
`;

$('header')[0].innerHTML = headerHTML;
$('footer')[0].innerHTML = footerHTML;

function handleDropdown(el,e) {
    el = el.parentElement;
    e.stopPropagation();
    let found = false;
    if (currentlyOpenDropdowns.length) {
        currentlyOpenDropdowns.forEach(dropdown=>{
            //debugger;
            if (dropdown[0] === el) {
                found = true;
                return;
            }
        });
        // we can assume that a match wasn't found [LOL this assumption didn't work because return; only stopped the forEach() function from running]
        searchForOpenDropdowns();
    }
    if (!found) {
        //debugger;
        /*console.log(currentlyOpenDropdowns);
        if (currentlyOpenDropdowns[0] === undefined) {
            e.stopPropagation();
        } else if (currentlyOpenDropdowns[0] !== el) {
            searchForOpenDropdown();
            e.stopPropagation();
        }*/

        const dropdown = el.querySelectorAll('.dropdown-options')[0];
        el.classList.add('selected');
        show(dropdown);
        //debugger;
        //console.log(el);
        currentlyOpenDropdowns.push([el,dropdown]);
    }
}

async function getJson(url,includesParameters) {
    let response;
    await fetch(`${url}${includesParameters ? '&' : '?'}r=${generateRandomString()}`).then(r=>r.json()).then(r=>response = r);
    return response;
}

function addElementsToContainer(container,arrayOfData,formatter,messageIfNoResult) {
    let containerInnerHTML = '';
    if (arrayOfData.length) {
        arrayOfData.forEach(pack=>{
            containerInnerHTML += formatter(pack);
        });
    } else if (messageIfNoResult) {
        containerInnerHTML = messageIfNoResult;
    }
    container.innerHTML = containerInnerHTML; // Instead of adding each pack individually, I store all the HTML in one string (containerInnerHTML) and then add it all at once, and it seems to be significantly faster.
}

function searchForOpenDropdowns() {
    //debugger;
    /*if (currentlyOpenDropdowns[1]) {
        close(currentlyOpenDropdowns[1]);
        currentlyOpenDropdowns[0].classList.remove('selected');
        currentlyOpenDropdowns = [];
    }*/
    currentlyOpenDropdowns.forEach((dropdown,index)=>{
        close(dropdown[1]);
        dropdown[0].classList.remove('selected');
        //currentlyOpenDropdowns.splice(index,1);
    });
    currentlyOpenDropdowns = [];
}

function generateRandomString() {
    const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; // Probably should have just google searched for an array - or actually typed 'qwertyuopasdfghjlzxcvbnm' and got a random index from that string.
    let randomString = '';
    for (i = 0; i < 9; i++) {
        const randomSpot = Math.floor(letters.length * Math.random());
        randomString += letters[randomSpot];
    }
    return randomString;
}

document.body.addEventListener('click',async e=>{
    if (e.target.matches('.dropdown-picked')) {
        handleDropdown(e.target,e);
    } else {
        searchForOpenDropdowns();
    }
    if (e.target.matches('#reload-button')) {
        location.reload();
    }
    if (e.target.matches('#dismiss-button')) {
        setTimeout(()=>{
            const t = document.querySelector('.toast');
            t.style.opacity = 0;
            setTimeout(()=>{
                t.style.display = none;
            },300)
        },100);
    }
    if (e.target.hasAttribute('data-username')) {
        const usernameThing = e.target.getAttribute('data-username');
        const theData = await grabDataFromUsername(usernameThing);
        displayUserInfo(theData,e.target);
    } else if (!e.target.matches('.link')) {
        infoPopupEl.classList.add('hidden');
    }
});

function checkForUpdate(timestamp) {
    const timestampInMs = timestamp * 1000;
    const twelveHours = msPerHour * 12;
    const currentTime = Date.now();
    console.log(currentTime - timestampInMs);
    console.log(msPerHour * 12);
    return currentTime - timestampInMs > twelveHours;
}

async function grabDataFromUsername(user) {
    let returnData;
    if (!playerData) {
        await loadPlayerData();
    }
    playerData.golds.forEach((player,index)=>{
        if (player.displayName === user) {
            player.goldRank = index + 1;
            returnData = player;
            return;
        }
    });
    return returnData;
}

function generateBadge(rank) {
    let badgeTitle;
    if (rank === 1) {
        badgeTitle = 'Top 1';
    } else if (rank <= 3) {
        badgeTitle = 'Top 3';
    } else if (rank <= 10) {
        badgeTitle = 'Top 10';
    } else if (rank <= 25) {
        badgeTitle = 'Top 25';
    } else if (rank <= 50) {
        badgeTitle = 'Top 50';
    }
    return badgeTitle ? `<span class="badge">${badgeTitle}</span>` : '';
}

function displayUserInfo(userData,targetEl) {
    infoPopupEl.classList.remove('hidden');
    infoPopupEl.innerHTML = `<img class="avatar" src="https://cravatar.eu/avatar/${userData.displayName}/64.png"/>
    <div class="main-info">
        <div class="name">${userData.displayName}${generateBadge(userData.goldRank)}</div>
        <div class="stats">
            <div class="stat"><span class="value">${userData.gold_trophy}</span> Golds</div>
            <div class="stat"><span class="value">${userData.coins}</span> Coins</div>
            <div class="stat"><span class="value">${userData.laps_completed}</span> Laps</div>
            <div class="stat"><span class="value">${userData.horn}</span> Horn</div>
        </div>
    </div>`;
    if (userData.socialMedia) {
        let linksHTML = '';
        infoPopupEl.classList.add('social-media');
        linksHTML += `<div class="links">`;
        for (site in userData.socialMedia) {
            linksHTML += `<a class="link" ${site === 'DISCORD' ? `onclick="copyTextToClipboard('${userData.socialMedia[site]}');this.innerHTML='COPIED'"` : `href="${userData.socialMedia[site]}"`} target="_blank">${site}</a>`;
        }
        linksHTML += `</div>`;
        infoPopupEl.innerHTML += linksHTML;
    } else {
        infoPopupEl.classList.remove('social-media');
    }
    infoPopupEl.style.top = targetEl.getBoundingClientRect().top + document.documentElement.scrollTop + targetEl.offsetHeight + 'px';
    infoPopupEl.style.left = targetEl.getBoundingClientRect().left + 'px';
}
