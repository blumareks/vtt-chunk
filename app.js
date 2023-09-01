// get express
const express = require("express");
const app = express();
const PORT = 4000;
//var tokens = 3000;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



// manipulate 0-n overlap
// spit json with chunks

const myVtt = "1\n"+
"00:08:14.680 --> 00:08:16.430\n"+
"Marcus Verri: The\n\n"+
"2\n"+
"00:08:23.130 --> 00:08:24.510\n"+
"Marcus Verri: hey? That's going to hear me.";


app.get('/', function (req, res) {
  res.send('Instructions:\n 1. use post to sumbit text in JSON: {"text":"some VTT"}');
})

app.post('/', function (req, res) {
    
    //the chunks
    var chunkArray = {
      chunks: []
    };

    //all vtts
    var vttArray = {
      vtts: []
    };
    
    // get text
    const text = req.body.text;
    console.log(text);
    var myText = ""+text;

    // get chunking_strategy
    const chunking_strategy = req.body.chunking_strategy;
    console.log("chunking_strategy", chunking_strategy);
    var myChunkingStrategy = ""+chunking_strategy;
    
    // get chunk_size
    const CHUNK_SIZE = req.body.chunk_size;
    console.log("chunk_size ", CHUNK_SIZE);
    //const myChunkSize = 0+chunk_size;

    // get overlap
    const overlap = req.body.overlap;
    console.log("overlap ", overlap);
    var myOverlap = 0+overlap;

    // length of the record chars
    var allCharLength = myText.length;
    console.log("text length: ", allCharLength);
    var wordLength = 0; //total length in words
  
    //wordChunk - how many words in the chunk
    var wordChunk = 0;
    //textChunk - all text in the chunk
    var textChunk = "";

    //checking if mytext is fine for chunking
    while (myText != "" && myText != null) {  
      // call chunking
      var myTextCharLength = myText.length;
      // find first chunk
      var positionOfEOL = myText.indexOf("\n\n");
      var wordCount = 0; 
      var aChunk = "";

      //console.log("position of double EOL ", positionOfEOL);
      // if EOL exists 
      if (0 <= positionOfEOL) {
        aChunk = myText.substring(0, positionOfEOL);
        var aChunkLength = aChunk.length;
        console.log(aChunk);
        
        //how many words are in the chunk?
        wordCount = 3; //all EOL
        var spacePos = 0;
        while (spacePos >= 0) {
          spacePos = aChunk.indexOf(" ", spacePos+1);
          if(spacePos>0) {
            wordCount++;
          }
        }
        //console.log("wordCount: ", wordCount);

        // add it to the chunk array
        var myVttChunk = {
          'text' : aChunk,
          //position of the VTT index
          //VTT timestamp
          //VTT name
          //VTT utterance
          //count the words only
          'words' : wordCount,
          //entire record
          'size' : aChunkLength,
        };
        //add it to a list
        vttArray.vtts.push(myVttChunk);
        myText = myText.substring(positionOfEOL+2,myTextCharLength);


      } else { //EOL -1
          //if no more chunks
          // add the last chunk to array
          aChunk = myText;
          var aChunkLength = aChunk.length;
          console.log(aChunk);
          
          //how many words are in the chunk?
          wordCount = 3; //all EOL
          var spacePos = 0;
          while (spacePos >= 0) {
            spacePos = aChunk.indexOf(" ", spacePos+1);
            if(spacePos>0) {
              wordCount++;
            }
          }
          console.log("wordCount: ", wordCount);


          // add it to the chunk array
          var myVttChunk = {
            'text' : aChunk,
            //position of the VTT index
            //VTT timestamp
            //VTT name
            //VTT utterance
            //count the words only
            'words' : wordCount,
            //entire record
            'size' : aChunkLength,
          };
          //add it to a list
          vttArray.vtts.push(myVttChunk);
          myText = "";
      }

      //0 overlap
      //check if (no of chunkWords + words) <= CHUNK_SIZE 
      if(CHUNK_SIZE > (wordChunk+wordCount)) {
        //add wordCount to chunkWords
        wordChunk = wordChunk+wordCount;
        console.log("partial wordChunk: ", wordChunk);
        
        //add text to textChunk
        textChunk = textChunk + "\n\n" + aChunk;
        console.log("partial textChunk: ", textChunk);
      } else {
        //add chunkText to chunkArray
        var myChunk = {
          'text' : textChunk,
          //count the words only
          'words' : wordChunk,
          //entire record
          'size' : textChunk.length,
        };
      
        chunkArray.chunks.push(myChunk);
        //restart textChunk and chunkWords with current
        textChunk = aChunk;
        wordChunk = wordCount;
        //if chunk is bigger than chunk_size 
            //throw too small chunk_size
            //or just devide it 
            //and attach it untill it is smaller...
      }

      //if that is the end of the string... ie. ""==myText, then wrap it up
      if(""==myText){
        var myChunk = {
          'text' : textChunk,
          //count the words only
          'words' : wordChunk,
          //entire record
          'size' : textChunk.length,
        };
        chunkArray.chunks.push(myChunk);
        console.log("final wordChunk: ", wordChunk);
        console.log("final textChunk: ", textChunk);
    
      }

    } //end of while loop for getting all records
    
    /*    
    for (var i = 0; i <vttArray.vtts.length; i++) {
      var textOfVtt = vttArray.vtts[i].text;
      var wordsInVtt = vttArray.vtts[i].words;
      console.log(i, "vtt: ", textOfVtt);
      console.log(i, "WORDS: ", wordsInVtt);
    }    
    */
    //getting all chunks now
    for (var i = 0; i <chunkArray.chunks.length; i++) {
      var textOfChunk = chunkArray.chunks[i].text;
      var wordsInChunk = chunkArray.chunks[i].words;
      console.log(i, "WORDS: ", wordsInChunk);
      console.log(i, "chunk: ", textOfChunk);
      wordLength = wordLength + wordsInChunk;
    } 
           
    res.send({"text":chunkArray, "words":wordLength});
})

app.post('/test', function (req, res) {
  res.send({"text":myVtt});
})

app.listen(4000);
console.log("listening on port " + PORT);


