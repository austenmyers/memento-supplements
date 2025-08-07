var api = 'https://api.ods.od.nih.gov/dsld/v9/'

function searchByBarCode(bar_code){
    var endpoint = 'search-filter?q='
    var url = api + endpoint + bar_code
    var response = http().get(url)
    if (response.code == 200){
        return JSON.parse(response.body)
    }
    else {return false}
}

function getID(data){
    var hits = data["hits"]
    var hit = hits[0]
    if (hit){
        return hit['_id']
    }
    else {return false}
}

function getLabelData(dsld_id){
    var endpoint = 'label/'
    var url = api + endpoint + dsld_id
    var response = http().get(url)
    if (response.code == 200){
        return JSON.parse(response.body)
    }
    else {
        return false
    }
}