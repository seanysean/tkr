//dropdown.style.top = el.getBoundingClientRect().top + document.documentElement.scrollTop + el.offsetHeight + 1 + 'px';
//dropdown.style.right = (document.documentElement.clientWidth - el.getBoundingClientRect().right) + 'px';
// ^ Some code for positioning an absolute element (dropdown) at the bottom of any other element (el)

const isLocal = (window.location.hostname === 'localhost');
const root = document.documentElement;
const resizeCheck = new ResizeObserver(updatePageHeight);

let currentlyOpenDropdowns = [];

function updatePageHeight() {
    let pageHeight = document.documentElement.offsetHeight;
    root.style.setProperty('--page-height',pageHeight + 'px');
}
//resizeCheck.observe(document.body);
//updatePageHeight();

function i(el) {
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

const headerHTML = `
<a href="${isLocal ? '/' : '/tkr/'}" class="logo">TKR</a>
<nav>
    <a href="#" class="nav-link"><i class="fas fa-medal"></i>Leaderboards</a>
    <a href="#" class="nav-link"><i class="fas fa-film"></i>Videos</a>
    <a href="${isLocal ? '/' : '/tkr/'}resourcepacks.html" class="nav-link"><i class="far fa-images"></i>Resource Packs</a>
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

/*document.querySelectorAll('.dropdown').forEach(el=>{
    el.addEventListener('click',event=>{
        handleDropdown(el,event);
        //console.log('hi');
    });
});*/
document.body.addEventListener('click',e=>{
    //debugger;
    //e.stopPropagation();
    if (e.target.matches('.dropdown-picked')) {
        //debugger;
        handleDropdown(e.target,e);
    } else {
        //debugger;
        searchForOpenDropdowns();
    }
    //console.log('hi2');
});
