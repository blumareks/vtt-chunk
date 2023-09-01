// get express

const express = require('express');
const app = express();
const PORT = 4000;
var tokens = 3000;

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
"Marcus Verri: hey? That's going to hear me.\n"+

"3\n"+
"00:08:24.880 --> 00:08:28.830\n"+
"Alex Goulding: Yeah, yeah. All good. Thanks.\n"+

"4\n"+
"00:08:29.420 --> 00:08:31.990\n"+
"Marcus Verri: So I'm: a little late before I tell the journey. I mean.\n"+

"5\n"+
"00:08:32.990 --> 00:08:34.150\n"+
"Marcus Verri: you Won't: Believe it.\n"+

"6\n"+
"00:08:34.720 --> 00:08:35.679\n"+
"Alex Goulding: You okay.\n"+

"7\n"+
"00:08:35.900 --> 00:08:51.300\n"+
"Marcus Verri: Yeah. Yeah, All good. But I am. I'm here in London for the event. and my dogs here because you couldn't take her to Spain. So i'm taking a chance to take her with me. And it's a really long journey. So basically i'm really close to the city airport.\n"+

"8\n"+
"00:08:52.250 --> 00:08:59.950\n"+
"Marcus Verri: My dogs close to the city center. So i'm here right now, because we need to get all the documentation sorted so we can cross the border.\n"+

"9\n"+
"00:09:00.110 --> 00:09:05.250\n"+
"Marcus Verri: Oh, Well, I you can drive you, fly or drop. I'm. Car pulling to Paris.\n"+

"10\n"+
"00:09:06.640 --> 00:09:09.470\n"+
"Marcus Verri: who is the dog, and then i'm sleeping over\n";


app.get('/', function (req, res) {
  res.send('Instructions:\n 1. use post to sumbit text in JSON: {"text":"some VTT"}');
})

app.post('/', function (req, res) {
    
    var vttArray = {
      vtts: []
    };
    console.log(req.body.toString());
    
    // get text
    var text = req.body.text;
    console.log(text);
    var myText = ""+text;

    // length of the record chars

    var allCharLength = myText.length;
    console.log("text length: ", allCharLength);
    var WordLength = 0;
  
    while (myText != "" && myText != null) {  
      // call chunking
      var myTextCharLength = myText.length;
      // find first chunk
      var positionOfEOL = myText.indexOf("\n\n");
      console.log("position of double EOL ", positionOfEOL);
      // if exists 
      if (0 <= positionOfEOL) {
        var aChunk = myText.substring(0, positionOfEOL);
        var aChunkLength = aChunk.length;
        console.log(aChunk);
        //how many words are in the chunk?
        var words = 3; //all EOL
        var spacePos = 0;

        while (spacePos >= 0) {
          spacePos = aChunk.indexOf(" ", spacePos+1);
          if(spacePos>0) {
            words++;
          }
        }
        console.log("words: ", words);

        // add it to the chunk array
        var myVttChunk = {
          'text' : aChunk,
          //position of the VTT index
          //VTT timestamp
          //VTT name
          //VTT utterance
          //count the words only
          'words' : words,
          //entire record
          'size' : aChunkLength,
        };
        //add it to a list
        vttArray.vtts.push(myVttChunk);
        myText = myText.substring(positionOfEOL+2,myTextCharLength);


      } else {
          //if no more chunks
          // add the last chunk to array
          var aChunk = myText;
          var aChunkLength = aChunk.length;
          console.log(aChunk);
          //how many words are in the chunk?
          var words = 3; //all EOL
          var spacePos = 0;

          while (spacePos >= 0) {
            spacePos = aChunk.indexOf(" ", spacePos+1);
            if(spacePos>0) {
              words++;
            }
          }
          console.log("words: ", words);


          // add it to the chunk array
          var myVttChunk = {
            'text' : aChunk,
            //position of the VTT index
            //VTT timestamp
            //VTT name
            //VTT utterance
            //count the words only
            'words' : words,
            //entire record
            'size' : aChunkLength,
          };
          //add it to a list
          vttArray.vtts.push(myVttChunk);
          myText = "";
      }
    }
        
    for (var i = 0; i <vttArray.vtts.length; i++) {
      var textOfVtt = vttArray.vtts[i].text;
      var wordsInVtt = vttArray.vtts[i].words;
      console.log(i, "vtt: ", textOfVtt);
      console.log(i, "WORDS: ", wordsInVtt);
    }    
  
    
    
    
    

    //"1\n"+
    //"00:08:14.680 --> 00:08:16.430\n"+
    //"Marcus Verri: The\n\n"

    
    //while


        
    res.send({"chunks":vttArray});
  })

app.post('/test', function (req, res) {
  res.send({"text":myVtt});
})

app.listen(4000);
console.log("listening on port " + PORT);


