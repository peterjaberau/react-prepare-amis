import jQuery from "jquery";
window.$ = window.jQuery = jQuery;
if (typeof window !== "undefined") {
  window.$ = window.jQuery = jQuery;
}

jQuery(document).ready(function() {
  const element = jQuery("#elementId");
  if (element.length) {
    element.detach();
  } else {
    console.error("Element with ID 'elementId' not found.");
  }
});
