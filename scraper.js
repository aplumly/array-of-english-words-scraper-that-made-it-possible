// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
const fs= require("fs");

querys = [ 'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_A-B/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_C-D/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_E-G/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_H-K/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_L-N/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_O-P/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_Q-R/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_S/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_T/',
            'https://www.oxfordlearnersdictionaries.com/us/wordlist/english/oxford3000/Oxford3000_U-Z/'
];
var results = [];
function getwords(i,page){
  let query = querys[i]+"?page="+page;
request(query, function(error, response, html) {

  var $ = cheerio.load(html);

  $("a").each(function(iterator, element) {

      if($(element).attr("title")!=null||$(element).attr("title")!=undefined){
        if ($(element).attr("title").includes("definition"))
        {
            let word = $(element).html();
            word=word.trim();
            let passedCheck=false;
            let vectorize = word.split(" ");
            if(vectorize.length==1)
            passedCheck=true;
            if(!word.includes("row")&&passedCheck)
                results.push(
                    word.toLowerCase()
                  );
               // console.log(word);
        }
      }


  });
  
  page++;
  if(page>10)
  {i++;page=1;}

  if(i<querys.length)
  setTimeout(function(){getwords(i,page)},500);
  else
  setTimeout(function(){writeToFile(results) },500);
  // Log the results once you've looped through each of the elements found with cheerio
});
}
function writeToFile(results){
  let str = 'String[] words = new String[]{"'+results[0]+'"'
  for(let i=1;i<results.length;i++){
    let element=results[i];
    str=str+',"'+element+'"';
  }
  str=str+"}"
  fs.writeFile("./javaArray.txt", str, function(err) {
    if(err) {
        return console.log(err);
    }

    

    console.log("The file was saved!");
}); 
}



getwords(0,1)





