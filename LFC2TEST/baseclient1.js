
//redirect uri example
//https://my_web_server/index.html?environment={{pcEnvironment}}&langTag={{pcLangTag}}

/*
let myClientApp = null;

// Note: This manual check for query string is for backwards compatibility of this
// deployed example.  In your own apps, you can assume the query param will be
// provided by PureCloud if you have configured it in your app's config.
let envQueryParamName = 'pcEnvironment';
if (window && window.location && typeof window.location.search === 'string' &&
    window.location.search.indexOf(envQueryParamName) >= 0) {
    myClientApp = new window.purecloud.apps.ClientApp({pcEnvironmentQueryParam: envQueryParamName});
} else {
    // Use default PureCloud region
    myClientApp = new window.purecloud.apps.ClientApp();
}


//Create Global ClientApp instance
var ClientApp = window.purecloud.apps.ClientApp;
var myClientApp = new ClientApp({
    pcEnvironmentQueryParam: 'pcEnvironment'
});
*/

window.$(document).ready(() => {
    //Page has loaded?

    //Setup handler for button click
    window.$('#alertbutton').Click((evt) => {
        evt.preventDefault();
        alert("Created an alert popup in browser!");
        //myClientApp.alerting.showToastPopup('Hello', 'alert in Genesys Cloud UI');
    });


})
