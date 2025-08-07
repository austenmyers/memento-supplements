function makeSearchURL(entry){
  var api = 'https://api.ods.od.nih.gov/dsld/'
  var ver = 'v9/'
  var endpoint = 'search-filter?q='

  var code = entry.field('Search Bar Code')
  if (code){
    return api + ver + endpoint + code
  }
}


function getID(entry){
  var id = entry.field('DSLD ID')
  if (id){ return id }
  else { return false }
}

function makeLabelURL(id){
  var api = 
    'https://api.ods.od.nih.gov/dsld/'
  var ver = 'v9/'
  var endpoint = 'label/'
  return api + ver + endpoint + id
}

function getData(id){
  var url = makeLabelURL(id)
  var response = http().get(url)
  var code = response.code
  var body = response.body

  if (code == 200){
    return JSON.parse(body)
  }
  else { return false }
}

function setName(entry, data) {
  var name = data["fullName"]
  entry.set('Product Name', name)
}

function getForm(notes){
  var start = notes.indexOf('(Form:') + 7
  var end = notes. indexOf(')')
  var form = notes.slice(start, end)
  return form
}

function getAKA(notes){
  var start = notes.indexOf('(Alt. Name: ')
  if (start != -1){
     var aka = notes.slice(start+12)
     var end = aka.indexOf(')')
     var aka = aka.slice(0, end)
     return aka
  }
  else {return ''}
}

function getIngredients(data, entry){
  var ings = data["ingredientRows"]
 // log(JSON.stringify(ings))
  var lib = libByName("Main Ingredients")
  var entries = []

  for (let ing of ings){
    var id = ing["ingredientId"]
    var ingEnt = lib.find(id)[0]
    if (ingEnt) {
      entries.push(ingEnt)
    }
    else {
      var notes = ing["notes"]
      var quantity = JSON.stringify(
        ing["quantity"]
      )
      if (notes) {
        var form = getForm(notes) 
        var aka = getAKA(notes)
      }
      else {
        var form = ''
      }
      var ingredient = {
        "ID": id,
        "Name": ing["name"],
        "Category": data["category"],
        "Form": form,
        "AKA": aka,
        "Full DSLD Notes": ing["notes"],
        "Quantity Object": quantity
      }
      //log(JSON.stringify(ingredient))
      var ingEnt = lib.create(ingredient)
      entries.push(ingEnt)
    }
  }
  return entries
}

function setDosages(product, data){
  var ings = product.field(
    'Main Ingredients')
  for (let i = 0; i < ings.length; i++){
    var dosage = data[i]["quantity"][0]
    var dose = dosage["quantity"]
    var ing = ings[i]
    ing.setAttr("Amount Per Serving", dose) 
    var units = dosage["unit"]
    ing.setAttr("Unit of Measure", units)
  }
}

function getOthers(data, entry){
  var ings = data["ingredients"]
  //log(JSON.stringify(ings))
  var lib = libByName("Other Ingredients")
  var entries = []

  for (let ing of ings){
    var id = ing["ingredientId"]
    var ingEnt = lib.find(id)[0]
    if (ingEnt) {
      entries.push(ingEnt)
    }
    else {
      var ingredient = {
        "ID": id,
        "Name": ing["name"],
        "Category": data["category"],
      }
      //log(JSON.stringify(ingredient))
      var ingEnt = lib.create(ingredient)
      entries.push(ingEnt)
    }
  }
  return entries
}

function updateCompany(data, entry){
  var companyObj = data["contacts"][0]
  var deets = companyObj["contactDetails"]
  //log(JSON.stringify(deets))
  var fields = [
    "DSLD ID", "Phone Number", "Email", 
    "Website", "City", "State", "Country",   
    "Zip Code"
  ]
  var values = [
    id, deets["phoneNumber"],
    deets["email"], deets["webAddress"],
    deets["city"], deets["state"], 
    deets["country"], deets["zipCode"]
  ]
  for (let i = 0; i < fields.length; i++){
    var field = fields[i]
    var value = values[i]
    entry.set(field, value)
  }
}

function setCompany(data, product){
  var brand = data["brandName"]
  var ip = data["brandIpSymbol"]
  if (ip !== 'none'){
    brand += ip
  }

  var companyObj = data["contacts"][0]
  var deets = companyObj["contactDetails"]
  //log(JSON.stringify(deets))
  var fields = [
    "DSLD ID", "Phone Number", "Email", 
    "Website", "City", "State", "Country",   
    "Zip Code"
  ]
  var values = [
    id, deets["phoneNumber"],
    deets["email"], deets["webAddress"],
    deets["city"], deets["state"], 
    deets["country"], deets["zipCode"]
  ]
  var id = companyObj["contactId"]
  var lib = libByName("Companies")
  var entryCN = lib.find(deets["name"])[0]
  var entryBN = lib.find(brand)[0]
  var entryID = lib.find(id)
  if (entryCN) {
    updateCompany(data, entryCN)

  }
  else if (entryBN) {
    updateCompany(data, entryBN)
  }
  else if (entryID){
    updateCompany(data, entryID)
  }
  else {
    var company = {
      "DSLD ID": id,
      "Company Name": deets["name"],
      "Phone Number": deets["phoneNumber"],
      "Email": deets["email"],
      "Website": deets["webAddress"],
      "City": deets["city"],
      "State": deets["state"],
      "Country": deets["country"],
      "Zip Code": deets["zipCode"],
      "Brand Name": brand 
    }
    log(JSON.stringify(company))
    var entry = lib.create(company)
  }
  product.set('Company', entry)
}