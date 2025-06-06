import settings from './settings';

var enableBieSearch = () => {
  // if (document.location.host !== 'localhost:3002') {

  // Maybe better:
  // if (/^datos.gbif.es/.test(window.location.host)) {

  if (document.location.host !== 'datos.gbif.es' &&
      document.location.host !== 'demo.gbif.es' &&
      document.location.host !== 'auth.gbif.es'
    // Is useful also
    // &&  document.location.host !== 'especies.gbif.es'
  ) {
    if (settings.isDevel) console.log(`Enabling BIE search in ${document.location.host}`);
    $('#top-search-icon-button').show();
    $('#top-search-icon-button-big').show();
    $('#top-search-icon-button-small').show();
  }
};

$(function(){
  enableBieSearch();
});
