const root = document.documentElement;
const resizeCheck = new ResizeObserver(updatePageHeight);
function updatePageHeight() {
    let pageHeight = document.body.offsetHeight;
    root.style.setProperty('--page-height',pageHeight + 'px');
}
resizeCheck.observe(document.body);
updatePageHeight();