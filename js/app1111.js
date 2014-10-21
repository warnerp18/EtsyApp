
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
    return $.getJSON(
        this.complete_api_url + "listings/active.js?api_key=" + this.api_key + "&includes=Images&callback=?"
        )
    .then(function(data) {
        return data;
    });
}

// this will load html template files 
EtsyClient.prototype.loadTemplate = function(name) {
    return $.get("./templates/" + name + ".html").then(function(){
        return arguments[0];
    })
}

// this will be putting data retrieved above and put it onto the site
EtsyClient.prototype.drawListings = function(templateString, data) {
    var grid = document.querySelector("#listings");  

    var bigHtmlString = data.results.map(function(listing){
        return _.template(templateString, listing);
    }).join('');

    grid.innerHTML = bigHtmlString;
}

EtsyClient.prototype.drawSingleListing = function(id) {
    var listing = this.latestData.results.filter(function(listing){
        return listing.listing_id === parseInt(id);
    });
    var grid = document.querySelector("#listings");

    var bigHtmlString = _.template(this.singleListingHtml, listing[0]);

    grid.innerHTML = bigHtmlString;
}

EtsyClient.prototype.setupRouting = function() {
    var self = this;

    Path.map("#/").to(function() {
        self.drawListings(self.listingHtml, self.latestData);
    });

    Path.map("#/message/:anymessage").to(function(){
        alert(this.params.anymessage);
    })

    Path.map("#/listing/:id").to(function() {
        self.drawSingleListing(this.params.id);
    });
    //set the default hash
    Path.root("#/");
}


EtsyClient.prototype.init = function() {
    var self = this;
    this.setupRouting();

    $.when(
        this.pullAllActiveListings(),
        this.loadTemplate("Listings"),
        this.loadTemplate("single-page-listing")
    ).then(function(data, html, singlePageHTML){

        self.latestDate= data;
        self.listingshtml = html;
        self.singleListingHtml = singlePageHTML;

        Path.listen();

    })
}







