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

function getID(entry){
  var id = entry.field('DSLD ID')
  if (id){ return id }
  else {
    var bar_code = entry.field('Search Bar Code')
    var id = searchByBarCode(bar_code)
    if (id){ return id}
    else {return false}
  }
}