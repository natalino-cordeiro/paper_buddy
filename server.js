const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidable = require('formidable');
const pdfUtil = require('pdf-text-extract');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', { upres: null });
});

app.post('/fileupload', function (req, res) {

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    var path = files.filetoupload.path;    
    var filename = files.filetoupload.name;

    if(err){
      console.dir(err);
      res.render('index', { upres: 'Error occurerd uploading the file: ' + filename });
      return;
    }
    
    pdfUtil(path, function (err, pages) {
      if (err) {
        console.dir(err);
        res.render('index', { upres: 'Error occurerd converting the file: ' + filename });
      }
      else{
        for (var i = 0; i < pages.length; i++) {
          var text = pages[i];
          console.dir(text);
        }

        res.render('index', { upres: 'File ' + filename + ' successfully uploaded!' });  
      }
    });

  });
});


app.post('/', function (req, res) {
  // let city = req.body.city;
  // let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  // request(url, function (err, response, body) {
  //   if (err) {
  //     res.render('index', { weather: null, error: 'Error, please try again' });
  //   } else {
  //     let weather = JSON.parse(body)
  //     if (weather.main == undefined) {
  //       res.render('index', { weather: null, error: 'Error, please try again' });
  //     } else {
  //       let weatherText = "It's ${weather.main.temp} degrees in ${weather.name}!";
  //       res.render('index', { weather: weatherText, error: null });
  //     }
  //   }
  // });
  res.render('index', { upres: null });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});