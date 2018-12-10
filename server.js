const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formidable = require('formidable');
const pdfUtil = require('pdf-text-extract');
const treeUtil = require('./word-prediction-tree');

var tree = new treeUtil.PrefixTree();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


function loadNGramsToTree(str, n){
  let nGramCount = 0;
  let words = str.split(/\s/g);
  
  if(words.length <= n){
    tree.addWord(str);
  }
  else {
    for(var i = n; i <= words.length; i++){
      let tempStr = "";

      // for n=3, this load the first 2 words...
      for(var j = i-n; j < n-1; j++){
        tempStr += str[j] + " ";
      }
      //...and the last one is added after the cycle, without using the space
      tempStr += str[i-1]; 
      
      // add the 'n-gram' to the tree
      tree.addWord(tempStr);
    }
  }
}

app.get('/', function (req, res) {

  // tree.addWord("This is a mother f...ing test!");
  // tree.logAllWords();

  res.render('index', { upres: null });
});

app.post('/fileupload', function (req, res) {

  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {

    var path = files.filetoupload.path;
    var filename = files.filetoupload.name;

    if (err) {
      console.dir(err);
      res.render('index', { upres: 'Error occurerd uploading the file: ' + filename });
      return;
    }

    pdfUtil(path, function (err, pages) {
      if (err) {
        console.dir(err);
        res.render('index', { upres: 'Error occurerd converting the file: ' + filename });
      }
      else {
        for (var i = 0; i < pages.length; i++) {
          let text = pages[i];
          // remove line breaks
          //text = text.replace(/\r?\n|\r/g, " ");
          // filter unwanted chars 
          text = text.replace(/[\r\n\d\s~@#$%^&*()_|+=",<>\{\}\[\]\\\/]+/g, " ");
          // cleanup extra spaces
          text = text.replace(/\s\s+/g, " ");
          
          //split text by divider chars .!?:;
          let filteredText = text.split(/[.!?]/g);

          for (var j = 0; j < filteredText.length; j++) {
            // We also need to remove any white spaces left at the start of each string
            loadNGramsToTree(filteredText[j].replace(/^\s+|\s+$/g, ''));
          }
        }
        
        tree.logAllWords();

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