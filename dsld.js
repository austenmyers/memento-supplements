var api = 'https://api.ods.od.nih.gov/dsld/v9/'

function searchByBarCode(bar_code){
    var endpoint = 'search-filter?q='
    var url = api + endpoint + bar_code
    var response = http().get(url)
    if (response.code == 200){
        var results = JSON.parse(response.body)
        return results
    }
    else {
        return false
    }
}