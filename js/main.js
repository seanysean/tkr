const root = document.documentElement;
const resizeCheck = new ResizeObserver(updatePageHeight);
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
    <a href="#">Hypixel Forums</a>
    <a href="#">Github</a>
    <a href="#">Discord</a>
</div>
`;

$('header')[0].innerHTML = headerHTML;
$('footer')[0].innerHTML = footerHTML;
