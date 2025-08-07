var api = 'https://api.ods.od.nih.gov/dsld/v9/'

function searchByBarCode(bar_code){
    var endpoint = 'search-filter?q='
    var url = api + endpoint + bar_code
    log('url: ' + url)
    var response = http().get(url)
    log('response: ' + response)
    if (response.code == 200){
        var data =  JSON.parse(response.body)
        log('data: ' + data)
        var hits = data["hits"]
        log('hits: ' + hits)
        var hit = hits[0]
        log('hit: ' + hit)
        if (hit){
            return hit['_id']
        }
        else {return false}
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