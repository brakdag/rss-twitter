var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: '4CXGmEvrvuNrh7qOVIKqn0VJi',
  consumer_secret: 'N9q5xSvjr3lV2NrvAxPBKjGMqf32YDevpZG255pCXWrLVQeigA',
  access_token_key: '59238476-LZcmQA1TJahrJC5TctihOPY1gAxIUC692wDXrEzII',
  access_token_secret: 'DEFyyHFhIV9lXwTU71Hna2rAhlAP9SHBx6Y5M3lcIMON3'
});
 

// Load your image
var data = require('fs').readFileSync('image.jpg');

// Make post request on media endpoint. Pass file data as media parameter
client.post('media/upload', {media: data}, function(error, media, response) {

  if (!error) {

    // If successful, a media object will be returned.
    console.log(media);

    // Lets tweet it
    var status = {
      status: 'I am a tweet',
      media_ids: media.media_id_string // Pass the media id string
    }

    client.post('statuses/update', status, function(error, tweet, response) {
      if (!error) {
        console.log(tweet);
      }
    });

  }
});