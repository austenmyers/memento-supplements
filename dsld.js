var api = 'https://api.ods.nih.gov/dsld/v9/'

function searchByBarCode(bar_code){
    var endpoint = 'search-filter?q='
    var url = api + endpoint + bar_code
    var response = http().get(url)
    if (response.code == 200){
        return response.body
    }
    else {
        return false
    }
}