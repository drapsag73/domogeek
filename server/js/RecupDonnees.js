var typeDevice = new Array("blind","binary_light","dimmable_light","smoke_sensor","door_sensor","temperature_sensor","motion_sensor","light_sensor");
var longTabTypeDevice = typeDevice.length;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest

// Récupère les différentes pièces
function listePieces(callback){
  var piecesHCL;
  var pageData = "";
  var xhr = new XMLHttpRequest();
  xhr.open('GET','http://78.233.143.4:8013/api/rooms',true,'domoticz','domoticz');
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200){
      piecesHCL = JSON.parse(xhr.responseText);
      pageData = JSON.stringify(piecesHCL, null, 2);
//      fs.writeFileSync("piecesHCL.json", pageData, "UTF-8");
      callback(piecesHCL);
    };
  };
}

// Récupère tous les modules
function listeModules(callback){
  // Récupère les différentes pièces
  listePieces(function(piecesHCL){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://78.233.143.4:8013/api/devices',true,'domoticz','domoticz');
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200){
        var pageData = xhr.responseText.replace(/ui.sldLevelValue.value/g,'levelValue');
        var jsonDataDevices = JSON.parse(pageData);
 //       var devicesLength = jsonDataDevices.length;
//        console.log("Nbr de modules = " + devicesLength);
 //       stringData = JSON.stringify(jsonDataDevices, null, 2);
//        fs.writeFileSync("configHCL.json", pageData, "UTF-8");
      // Construit le fichier de configuration config.json
        var ficJSON = '{"name": "Frontonas","devices": [';
        var maison = new Object();
        var devices = [];
        var tempDevices = [];
        maison.home = "Frontonas";
        maison.devices = devices;
        for(var device in jsonDataDevices){
          if(device > 0) ficJSON += ',';
          for(var piece in piecesHCL){
            if(piecesHCL[piece].id == jsonDataDevices[device].roomID){
//              var etage = (piecesHCL[piece].sectionID-1)
//              var pieceFronto = piecesHCL[piece].name.replace(/ /g, "-");
              var nodeBlind = 0;
              var node = jsonDataDevices[device].id;
              var item = jsonDataDevices[device].name;
              var pieceFronto = piecesHCL[piece].name.replace(/ /g, "-");
              var etage = (piecesHCL[piece].sectionID-1) + ',';
              var constructeur = "";
//              var level = jsonDataDevices[device].properties.value;
              switch(jsonDataDevices[device].type) {
                case "blind":
                  var nodeBlind = node;
                  var node = "Fenêtre"+device;
                  var type = "fenetre";
                  var level = jsonDataDevices[device].properties.value;
                  tempDevices.push(new module(node, nodeBlind, item, pieceFronto, etage, type, constructeur, level));
                break;
                case "virtual_device":
                  var node = "Fenêtre"+device;
                  var type = "fenetre";
                  var level = jsonDataDevices[device].properties.levelValue;
                  tempDevices.push(new module(node, nodeBlind, item, pieceFronto, etage, type, constructeur, level));
                break;
                default:
                  var type = jsonDataDevices[device].type;
                  if((jsonDataDevices[device].type == "binary_light" || jsonDataDevices[device].type == "door_sensor") && jsonDataDevices[device].properties.value == 1){
                    var level = 100;
                  }
                  else {
                    var level = jsonDataDevices[device].properties.value;
                  }
										if(item == 'Prise'){
											type = "prise"
										}
                  devices.push(new module(node, nodeBlind, item, pieceFronto, etage, type, constructeur, level));
              }  

            }  
          }
        }
        longTempDevices = tempDevices.length;
        var moduleOk = false;
        for(var x=0; x < longTempDevices - 1; x++){
          if(tempDevices[x]){
            node = tempDevices[x].node;
            nodeBlind = tempDevices[x].nodeBlind;
            item = tempDevices[x].item;
            piece = tempDevices[x].piece;
            etage = tempDevices[x].etage;
            type = tempDevices[x].type;
            constructeur = tempDevices[x].constructeur;
            for(var y = x + 1; y < longTempDevices; y++){
              if(tempDevices[y]){
                nodey = tempDevices[y].node;
                nodeBlindy = tempDevices[y].nodeBlind;
                itemy = tempDevices[y].item;
                piecey = tempDevices[y].piece;
                etagey = tempDevices[y].etage;
                typey = tempDevices[y].type;
                constructeury = tempDevices[y].constructeur;
                tempItemX = tempDevices[x].item.split(" ")[0];
                tempItemX_1 = tempDevices[x].item.split(" ")[1];
                tempItemY = tempDevices[y].item.split(" ")[0];
                tempItemY_1 = tempDevices[y].item.split(" ")[1];
                if(tempItemX == tempItemY){
                  moduleOk = true;
                  switch(tempDevices[x].level * 1){
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                      switch(tempDevices[y].level * 1){
                        case 0:
                          levelValue = "fermee-ferme";
                          break;
                        case 100:
                          levelValue = "ouverte-ferme";
                          break;
                        default:
                          levelValue = "erreur"
                      }
                      break;
                    case 95:
                    case 96:
                    case 97:
                    case 98:
                    case 99:
                    case 100:
                      switch(tempDevices[y].level * 1){
                        case 0:
                          levelValue = "fermee-ouvert";
                          break;
                        case 100:
                          levelValue = "ouverte-ouvert"
                          break;
                      }
                      break;
                    default:
                      switch(tempDevices[y].level * 1){
                        case 0:
                          levelValue = "fermee-miferme";
                          break;
                        case 100:
                          levelValue = "ouverte-miferme"
                          break;
                      }
                  }
                  tempDevices[x].level = levelValue;
                  tempDevices[x].item = tempItemX;
                 devices.push(new module(node, nodeBlind, item, piece, etage, type, constructeur, levelValue));
                  if(y < longTempDevices-1){
                    delete tempDevices[y];
                  }
                }
              }
            }
          }
          if(!moduleOk){
            if(tempItemX_1){
              switch(tempItemX_1){
                case "Poignée":
                  switch(tempDevices[x].level * 1){
                    case 0:
                      levelValue = "fermee-sans";
                      tempDevices[x].level = "fermee-sans";
                      tempDevices[x].item = tempItemX;
                    break;
                    case 100:
                      levelValue = "ouverte-sans";
                      tempDevices[x].level = "ouverte-sans";
                      tempDevices[x].item = tempItemX;
                    break;
                    default:
                    break;
                  } 
                break;
                case "Volet":
                  switch(tempDevices[x].level * 1){
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                      levelValue = "fermee-ferme";
                      tempDevices[x].level = "fermee-ferme";
                      tempDevices[x].item = tempItemX;
                    break;
                    case 95:
                    case 96:
                    case 97:
                    case 98:
                    case 99:
                    case 100:
                      levelValue = "fermee-ouvert";
                      tempDevices[x].level = "fermee-ouvert";
                      tempDevices[x].item = tempItemX;
                    break;
                    default:
                      levelValue = "fermee-miferme";
                      tempDevices[x].level = "fermee-miferme";
                      tempDevices[x].item = tempItemX;
                    break;
                  }
                break;
              } 
              devices.push(new module(node, nodeBlind, item, piece, etage, type, constructeur, levelValue));
            }
            if(y == longTempDevices && tempItemY_1){
              switch(tempItemY_1){
                case "Poignée":
                  switch(tempDevices[y-1].level * 1){
                    case 0:
                      levelValue = "fermee-sans";
                      tempDevices[y-1].level = "fermee-sans";
                      tempDevices[y-1].item = tempItemY;
                      break;
                    case 100:
                      levelValue = "ouverte-sans";
                      tempDevices[y-1].level = "ouverte-sans";
                      tempDevices[y-1].item = tempItemY;
                      break;
                    default:
                      break;
                  }
                  break;
                case "Volet":
                  switch(tempDevices[y-1].level * 1){
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                      levelValue = "fermee-ferme";
                      tempDevices[y-1].level = "fermee-ferme";
                      tempDevices[y-1].item = tempItemY;
                      break;
                    case 95:
                    case 96:
                    case 97:
                    case 98:
                    case 99:
                    case 100:
                      levelValue = "fermee-ouvert";
                      tempDevices[y-1].level = "fermee-ouvert";
                      tempDevices[y-1].item = tempItemY;
                      break;
                    default:
                      levelValue = "fermee-miferme";
                      tempDevices[y-1].level = "fermee-miferme";
                      tempDevices[y-1].item = tempItemY;
                  }
              }        
              devices.push(new module(nodey, nodeBlindy, itemy, piecey, etagey, typey, constructeury, levelValue));
            }
          } // Fin !moduleOk
        moduleOk = false;
        }
        tempPageData = maison.devices.sort(sortByPieceAndPosition);
        pageData = JSON.stringify(tempPageData, null, 2)
        fs.writeFileSync("config.json", pageData, "UTF-8");
        callback(maison);
      };
    };
  });
}

function module(node, nodeBlind, item, piece, etage, type, constructeur, level){
  this.node = node;
  this.nodeBlind = nodeBlind;
  this.item = item;
  this.piece = piece;
  this.etage = etage;
  this.type = type;
  this.constructeur = constructeur;
  this.level = level;
}

function envoieCommande(message, callback){
  var xhr = new XMLHttpRequest();
  // console.log("valeur 1 = " + message.valeur)
  // valeur = (message.valeur==0) ? 99 : 0
  var type = message.type;
  var valeur = message.valeur;
  switch(type){
  case 'binary_light':
    if(valeur <= 5){
      var action = 'turnOff';
    }
    else {
      var action = 'turnOn';
    }
    var temp = 'http://78.233.143.4:8013/api/callAction?deviceID=' + message.node + '&name=' + action
    console.log(temp)
    break;
  case 'fenetre':
    var temp = 'http://78.233.143.4:8013/api/callAction?deviceID=' + message.node + '&name=setValue&arg1=' + valeur
    console.log(temp)
    break;
  default:
    break;
  }
    
  xhr.open('GET',temp,true,'domoticz','domoticz');
  xhr.send(null);
  callback(valeur);
}

function sortByPieceAndPosition(a,b) {
 	//return 1, if you want b to come first 	
  //return -1, if you want a to come first 	
  //return 0, if both objects are the same 
  if(a.piece < b.piece) 	{
    return -1; 	
  } 	
  else if(a.piece > b.piece) 	{
    return 1; 	
  }
  else if(a.type < b.type) 	{
    return -1; 	
  } 	
  else if(a.type > b.type) 	{
    return 1; 	
  } 	
 	else if(a.position < b.position) 	{
    return -1;
 	} 	
  else if(a.position > b.position) 	{
    return 1; 	
  }
 	else 	{
    return 0; 	
  } 
}

exports.listeModules = listeModules;
exports.envoieCommande = envoieCommande;