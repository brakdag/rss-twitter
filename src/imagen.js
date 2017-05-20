var requestImg = require('request').defaults({ encoding: null });

  
var req =  requestImg('https://pbs.twimg.com/media/DARPNPvXsAAtfh0.jpg', function (err, res, body) {    
  console.log('error:', err); // Print the error if one occurred
  console.log('statusCode:', res && res.statusCode); // Print the response status code if a response was received
    
    if (res.statusCode == 200)
    {
         console.log(body);
    if (err)
        console.log(err);
    else
        console.log('El archivo fue creado');
    }
});

