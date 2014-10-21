
window.onload = app;

// runs when the DOM is loaded
function app(){

    // load some scripts (uses promises :D)
    loader.load(
        {url: "./bower_components/jquery/dist/jquery.min.js"},
        {url: "./bower_components/lodash/dist/lodash.min.js"},
        {url: "./bower_components/jquery-iconify"},
        {url: "./bower_components/pathjs/path.min.js"}
    ).then(function(){
        _.templateSettings.interpolate = /{([\s\S]+?)}/g;

        var options = {
            api_key: "e5akcrosbhe7wyu22vdfda2b"
        }
        var client = new EtsyClient(options);
    })

}

function EtsyClient(options) {
    if (!options.api_key) {
        throw new Error("Yo dawg, I heard you like APIs. Y U NO APIKEY!?!?");
    }
    this.etsy_url = "https://openapi.etsy.com/";
    this.version = options.api_version || "v2/";
    this.api_key = options.api_key;
    this.complete_api_url = this.etsy_url + this.version;

    this.init();
}

// this will be getting all the listings (objects) from the Etsy site using our API Key
EtsyClient.prototype.pullAllActiveListings = function() {
    var model = 'listings/';
    var filter = 'active';
    return $.getJSON(this.complete_api_url + model + filter + ".js?api_key=" + this.api_key + "&includes=Images&callback=?").then(function(data) {
        return data;
    });
}

//this will be getting info about a single listing (object) and putting it on a page when the item is clicked
EtsyClient.prototype.getListingInfo = function(id) {
    var model = 'listings';
    return $.getJSON(this.complete_api_url + model + '/' + id + ".js?api_key=" + this.api_key + "&callback=?").then(function(data) {
       return data;
    });
}

// this will load html template files 
EtsyClient.prototype.loadTemplate = function(name) {
    return $.get('./templates/' + name + '.html').then(function(){
        return arguments[0];
    })
}

// this will be putting data retrieved above and put it onto the site
EtsyClient.prototype.showListings= function(listingshtml, data) {
    var grid = document.querySelector('.item');  

    var allListings = data.results.map(function(listings){
        return listings.listing_id === parseInt(id);
    });

};


EtsyClient.prototype.init = function() {
    var self = this;

    $.when(
        this.pullAllActiveListings(),
        this.loadTemplate("Listings")
    ).then(function(html, data){
        self.latestDate= data;
        self.listingshtml = html;
        self.showListings = (Listingshtml, data)

    })
};







