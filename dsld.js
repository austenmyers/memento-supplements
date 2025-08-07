// Create URL with barcode.
function makeURL(bar_code){
    var api = 'https://api.ods.nih.gov/dsld/v9/'
    var endpoint = 'search-filter?q='
    return api + endpoint + bar_code
}