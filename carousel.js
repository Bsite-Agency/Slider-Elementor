// This script is made to modify behaviour of the elementor-widget.
// By using it you will get a simple slideshow-like apearance.

// @author Jakub Marchut <kuba.marchut@gmail.com>

let verbose = true; // shows debug information in browsers console
let mainDiv = ".elementor-widget-woolentor-universal-product"; // points to the main div which contains overflowing elements
let delay = 2000; // set delay between each "step" ignored in marqee mode
let pauseOnHover = true; // decide whether animation should stop when user hovers over
let infiniteMode = false;
let marqeeMode = true;
let hideNotVisible = false;


let modifiedElementorWidget = document.querySelector(mainDiv);
if (modifiedElementorWidget != null) {
  let modifiedElementorWidgetContainer = modifiedElementorWidget.children[0].children[0];
  let modifiedSingleElements = modifiedElementorWidgetContainer.children;

  if (marqeeMode) {
    delay = 15;
  }
  if (infiniteMode) {
    for (var i = 0; i < modifiedSingleElements.length; i++) {
      //modifiedSingleElements[i].style.opacity = 0;
      modifiedSingleElements[i].style.transition = "1.2s opacity ease";
    }
  }
  if (hideNotVisible) {
    modifiedElementorWidgetContainer.addEventListener("scroll", hideNotVisibleHandler)
  }
  modifiedElementorWidgetContainer.style.flexWrap = "noWrap";
  modifiedElementorWidgetContainer.style.overflow = "hidden";
  let modifiedElementorWidgetGap = window.getComputedStyle(modifiedSingleElements[0]).paddingLeft;

  modifiedElementorWidget.children[0].style.marginLeft = "-" + modifiedElementorWidgetGap;
  modifiedElementorWidget.children[0].style.marginRight = "-" + modifiedElementorWidgetGap;
  modifiedElementorWidgetContainer.style.padding = modifiedElementorWidgetGap;

  let moveInterval = setInterval(moveProducts, delay);
  if(pauseOnHover){
    modifiedElementorWidget.addEventListener("mouseenter", () => {
      clearInterval(moveInterval);
    })
    modifiedElementorWidget.addEventListener("mouseleave", () => {
      moveProducts();
      moveInterval = setInterval(moveProducts, delay);
    })
  }
}
else if (verbose) console.log("Main element was not found");

let offset = 0;
function hideNotVisibleHandler(){
  let modifiedElementorWidgetContainer = modifiedElementorWidget.children[0].children[0];
  let modifiedSingleElements = modifiedElementorWidgetContainer.children;
  for (var i = 0; i < modifiedSingleElements.length; i++) {
    if (isScrolledIntoView(modifiedSingleElements[i])) {
      modifiedSingleElements[i].style.opacity = 1;
    }
    else {
      modifiedSingleElements[i].style.opacity = 0;
    }
  }
}
function isScrolledIntoView(ele){
  let rect = ele.getBoundingClientRect();
  let eleLeft = rect.left;
  let eleRight = rect.right;

  let parentRect = ele.parentNode.getBoundingClientRect();
  let parentLeft = parentRect.left;
  let parentRight = parentRect.right;

  // Only completely visible elements return true:
  let isVisible = (eleLeft >= 0) && (eleRight <= ele.parentNode.innerWidth);
  // Partially visible elements return true:
  isVisible = eleLeft - parentRight < (-rect.width / 2) && eleRight - parentLeft > (rect.width / 2);
  return isVisible;
}
function moveProducts() {
  let modifiedElementorWidgetContainer = modifiedElementorWidget.children[0].children[0];
  let modifiedSingleElements = modifiedElementorWidgetContainer.children;
  let step = parseInt(modifiedSingleElements[0].offsetWidth);
  if (marqeeMode) {
    step = 1;
  }
  if (modifiedElementorWidgetContainer.scrollWidth - modifiedElementorWidgetContainer.offsetWidth - offset > 10){
    offset += step;
  }
  else offset = 0;
  if (!marqeeMode) {
    modifiedElementorWidgetContainer.scrollTo({left: offset, behavior: 'smooth'});
  }
  else {
    modifiedElementorWidgetContainer.scrollTo({left: offset});
  }
}
