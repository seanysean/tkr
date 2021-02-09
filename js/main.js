const root = document.documentElement;
const resizeCheck = new ResizeObserver(updatePageHeight);

let currentlyOpenDropdown = [];

function updatePageHeight() {
    let pageHeight = document.documentElement.offsetHeight;
    root.style.setProperty('--page-height',pageHeight + 'px');
}
resizeCheck.observe(document.body);
updatePageHeight();

function i(el) {
    return document.getElementById(el);
}
function $(el) {
    return document.querySelectorAll(el);
}

function show(el) {
    console.log('show!');
    el.style.display = 'block';
    setTimeout(()=>{
        el.classList.add('open');
    },100)
    //debugger;
}
function close(el) {
    console.log('close');
    el.classList.remove('open');
    setTimeout(()=>{
        el.style.display = 'none';
    },100);
}

const headerHTML = `
<a href="/" class="logo">TKR</a>
<nav>
    <a href="#" class="nav-link"><i class="fas fa-medal"></i>Leaderboards</a>
    <a href="#" class="nav-link"><i class="fas fa-film"></i>Videos</a>
    <a href="#" class="nav-link"><i class="far fa-images"></i>Resource Packs</a>
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
    console.log(currentlyOpenDropdown);
    if (currentlyOpenDropdown[0] === undefined) {
        e.stopPropagation();
    } else if (currentlyOpenDropdown[0] !== el) {
        searchForOpenDropdown();
        e.stopPropagation();
    }
    const dropdown = el.querySelectorAll('.dropdown-options')[0];
    //dropdown.style.top = el.getBoundingClientRect().top + document.documentElement.scrollTop + el.offsetHeight + 1 + 'px';
    //dropdown.style.right = (document.documentElement.clientWidth - el.getBoundingClientRect().right) + 'px';
    el.classList.add('selected');
    show(dropdown);
    //debugger;
    //console.log(el);
    currentlyOpenDropdown = [el,dropdown];
}
function searchForOpenDropdown() {
    if (currentlyOpenDropdown[1]) {
        close(currentlyOpenDropdown[1]);
        currentlyOpenDropdown[0].classList.remove('selected');
        currentlyOpenDropdown = [];
    }
}

document.querySelectorAll('.dropdown').forEach(el=>el.addEventListener('click',event=>{handleDropdown(el,event)}));
document.body.addEventListener('click',searchForOpenDropdown);
