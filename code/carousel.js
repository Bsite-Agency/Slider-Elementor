// This script is made to modify behaviour of the elementor-widget.
// By using it you will get a simple slideshow-like apearance.

// @author Jakub Marchut <kuba.marchut@gmail.com>

const carouselSilderModifier = () => {
  let verbose = true; // shows debug information in browsers console
  let mainDiv = ".elementor-widget-woolentor-universal-product"; // points to the main div which contains overflowing elements
  let delay = 2000; // set delay between each "step" ignored in marqee mode
  let pauseOnHover = true; // decide whether animation should stop when user hovers over
  let infiniteMode = true;
  let marqeeMode = true;
  let hideNotVisible = true;

  function findSectionParent(ele){
    let parent = ele.parentNode;
    while (parent.tagName.toLowerCase() != "section") {
      parent = parent.parentNode;
    }

    return parent;
  }
  function removeNextSectionMargin(section){
    let siblingSection = section.nextElementSibling;
    siblingSection.style.marginTop = "0";
  }
  function duplicateVisible(){
    for (var i = 0; i < modifiedSingleElements.length; i++) {
      if (isScrolledIntoView(modifiedSingleElements[i], 0.75)) {
        let clone = modifiedSingleElements[i].cloneNode(true);
        modifiedElementorWidgetContainer.appendChild(clone);
      }
      else break;
    }
  }

  let modifiedElementorWidget = document.querySelectorAll(mainDiv)[2];
  let modifiedElementorWidgetContainer;
  let modifiedSingleElements;
  if (modifiedElementorWidget != null) {
    modifiedElementorWidgetContainer = modifiedElementorWidget.children[0].children[0];
    modifiedSingleElements = modifiedElementorWidgetContainer.children;
    removeNextSectionMargin(findSectionParent(modifiedElementorWidget));
    if (marqeeMode) {
      delay = 1/60*1000;
    }
    if (hideNotVisible) {
      for (var i = 0; i < modifiedSingleElements.length; i++) {
        //modifiedSingleElements[i].style.opacity = 0;
        modifiedSingleElements[i].style.transition = "0.6s opacity ease";
      }
      modifiedElementorWidgetContainer.addEventListener("scroll", hideNotVisibleHandler);
    }
    modifiedElementorWidgetContainer.style.flexWrap = "noWrap";
    modifiedElementorWidgetContainer.style.overflow = "hidden";
    modifiedElementorWidgetContainer.style.boxSizing = "border-box";
    let modifiedElementorWidgetGap = window.getComputedStyle(modifiedSingleElements[0]).paddingLeft;
    let maxMinusMargin = modifiedElementorWidget.getBoundingClientRect().left;
    maxMinusMargin = Math.min(parseInt(maxMinusMargin), parseInt(modifiedElementorWidgetGap));
    console.log(maxMinusMargin);
    modifiedElementorWidget.children[0].style.marginLeft = `-${maxMinusMargin}px`;
    modifiedElementorWidget.children[0].style.marginRight = `-${maxMinusMargin}px`;
    modifiedElementorWidgetContainer.style.padding = `0 ${maxMinusMargin}px ${parseInt(modifiedElementorWidgetGap)*4}px`;
    if (infiniteMode) {
      duplicateVisible();
    }
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
    if (isScrolledIntoView(modifiedSingleElements[i], 0.25)) {
      modifiedSingleElements[i].style.opacity = 1;
    }
    else {
      modifiedSingleElements[i].style.opacity = 0;
    }
  }
  }
  function isScrolledIntoView(ele, frac){
    let rect = ele.getBoundingClientRect();
    let eleLeft = rect.left;
    let eleRight = rect.right;

    let parentRect = ele.parentNode.getBoundingClientRect();
    let parentLeft = parentRect.left;
    let parentRight = parentRect.right;

    // Only completely visible elements return true:
    let isVisible = (eleLeft >= 0) && (eleRight <= ele.parentNode.innerWidth);
    // Partially visible elements return true:
    isVisible = eleLeft - parentRight < (-rect.width * frac) && eleRight - parentLeft > (rect.width * frac);
    return isVisible;
  }
  function moveProducts() {
    let modifiedElementorWidgetContainer = modifiedElementorWidget.children[0].children[0];
    let modifiedSingleElements = modifiedElementorWidgetContainer.children;
    let step = parseInt(modifiedSingleElements[0].offsetWidth);
    if (marqeeMode) {
      step = 1;
    }
    let chk = modifiedElementorWidgetContainer.scrollWidth - modifiedElementorWidgetContainer.offsetWidth - offset - step;
    if (infiniteMode && (marqeeMode && chk == step) || (chk < step && chk > -step)) {
      setTimeout(()=>{
        if (hideNotVisible) {
          for (var i = 0; i < modifiedSingleElements.length; i++) {
            modifiedSingleElements[i].style.transitionDuration = "0s";
          }
        }
        offset = 0;
        modifiedElementorWidgetContainer.scrollTo({left: offset});
      }, delay/2);
      setTimeout(()=>{
        if (hideNotVisible) {
          for (var i = 0; i < modifiedSingleElements.length; i++) {
            modifiedSingleElements[i].style.transitionDuration = "0.6s";
          }
        }
      }, delay);
    }
    if (modifiedElementorWidgetContainer.scrollWidth - modifiedElementorWidgetContainer.offsetWidth - offset > 10){
      offset += step;
    }
    else if (marqeeMode && modifiedElementorWidgetContainer.scrollWidth - modifiedElementorWidgetContainer.offsetWidth - offset > step) {
      offset += step;
    }
    else {
      offset = 0;
    }
    if (!marqeeMode && (infiniteMode && offset != 0)) {
      modifiedElementorWidgetContainer.scrollTo({left: offset, behavior: 'smooth'});
    }
    else {
      modifiedElementorWidgetContainer.scrollTo({left: offset});
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  carouselSilderModifier();
}, false);
