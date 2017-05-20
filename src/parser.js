/* Creado por brakdag@gmail.com Gusavo David Ferreyra
* Mayo de 2017
* 
*/


var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed 
var Twitter = require('twitter');
var requestImg = require('request').defaults({ encoding: null });
var debug = false;

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});



var obtenerRSSDatos = function(callback)
{
var datos = [];
var req = request('https://www.amazon.es/rss/bestsellers/grocery/ref=zg_bs_nav_0?tag=supermarket-21');
var feedparser = new FeedParser();
 
req.on('error', function (error) {
  // handle any request errors 
});
 
req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream 
 
  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});
 
feedparser.on('error', function (error) {
  // always handle errors 
});
feedparser.on('end', function(){

for(var i in datos)
{
var pos = datos[i].description.indexOf('https://images-eu.ssl-images-amazon.com/images/I');
var pos2 = datos[i].description.indexOf('"', pos);
datos[i].image =  datos[i].description.substr(pos,pos2-pos);
//console.log('titulo:'+ datos[i].title + 'link: ' + datos[i].link + 'image: '+ datos[i].image );
}
callback(datos);
});

feedparser.on('readable', function () {
  // This is where the action is! 
  var stream = this; // `this` is `feedparser`, which is a stream 
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance 
  var item;

 while (item = stream.read()) {  
      var titulo = item.title.substr(4,item.title.length-4);
      datos.push({'title': titulo, 'link': item.link,'image':'', 'description':item.description});
     }

  });

}


var AlmacenDatos = function()
{
  this.data = [];
}

AlmacenDatos.prototype.init= function(datos)
{
for(var i in datos)
  {
    this.data.push(datos.image);
  }
}
AlmacenDatos.prototype.add = function (dato)
{ 
  this.data.push(dato);
 if (this.data.length>20) this.data.pop();
 this.save();
}
AlmacenDatos.prototype.exists = function(dato)
{
  for (var i in this.data)
  {
    if(this.data[i]==dato) return true;
  }
  return false;
}
AlmacenDatos.prototype.save = function()
{
var fs=require('fs');
  fs.writeFile('./datos.json',this.data.toString,function(error){
    if (error)
        console.log(error);
    else
        console.log('El archivo fue creado');
});
}

AlmacenDatos.prototype.load = function()
{
var fs=require('fs');
 fs.readFile('./datos.json',function(error,abierto){
    if (error) {
        console.log(error);
    }	
    else {
        console.log(abierto.toString());
    }
});
}


/*
*     Crea un mensaje en twitter
* @params:texto  texto a publicar.
* @params:imagen  url de la imagen
*/
function twittear(texto,url,imagen)
{

client.post('statuses/update', {status: url },  function(error, tweet, response) {
  if(error) console.log( error);
  console.log(tweet);  // Tweet body. 
  console.log(response);  // Raw response object. 
});
/*  // carga la imagen
var req =  requestImg(imagen, function (err, res, body) {    
    
    if (res.statusCode == 200)
    {
         //codigo acá
    // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {media: body}, function(error, media, response) {

        if (!error) {

        // If successful, a media object will be returned.
        console.log(media);

        // Lets tweet it
        var status = {
          status: texto,
          media_ids: media.media_id_string // Pass the media id string
        }

        client.post('statuses/update', status, function(error, tweet, response) {
          if (!error) {
            console.log(tweet);
          }
        });

      }
    });

        if (err)
            console.log(err);
        else
            console.log('El archivo fue creado');
        }
    });

*/
}


/*

*/
var archivo = new AlmacenDatos();

function publicar()
{
  console.log('leyendo datos');
  var a =  new obtenerRSSDatos(function(datos){
     for(var i in datos)
      {
       
          if( archivo.exists(datos[i].image)== false)
           {
            if (!debug)   twittear(datos[i].title, datos[i].link,datos[i].image);  
           archivo.add(datos[i].image);
           }
      }

});

}


publicar();
setInterval(publicar,1000*3600);