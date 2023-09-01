# vtt-chunk

## running node

```bash
npm install
npm run build
node app.js
```

## running docker

```bash
podman image build . -t <your_dockerhub_name>/<container_name>:tag

podman run -p 4000:4000 <image_name/image_id>
```

## calling it from python

```python
import requests
import json

url = "localhost:4000/"

payload = json.dumps({
   "chunking_strategy": "newline",
  "chunk_size": 3000,
  "overlap": 0,
  "text": "1\n00:08:14.680 --> 00:08:16.430\nMarcus Verri: The\n\n2\n00:08:23.130 --> 00:08:24.510\nMarcus Verri: hey? That's going to hear me.\n\n3\n00:08:24.880 --> 00:08:28.830\nAlex Goulding: Yeah, yeah. All good. Thanks.\n\n4\n00:08:29.420 --> 00:08:31.990\nMarcus Verri: So I'm: a little late before I tell the journey. I mean.\n5\n00:08:32.990 --> 00:08:34.150\nMarcus Verri: you Won't: Believe it.\n6\n00:08:34.720 --> 00:08:35.679\nAlex Goulding: You okay.\n7\n00:08:35.900 --> 00:08:51.300\nMarcus Verri: Yeah. Yeah, All good. But I am. I'm here in London for the event. and my dogs here because you couldn't take her to Spain. So i'm taking a chance to take her with me. And it's a really long journey. So basically i'm really close to the city airport.\n8\n00:08:52.250 --> 00:08:59.950\nMarcus Verri: My dogs close to the city center. So i'm here right now, because we need to get all the documentation sorted so we can cross the border.\n9\n00:09:00.110 --> 00:09:05.250\nMarcus Verri: Oh, Well, I you can drive you, fly or drop. I'm. Car pulling to Paris.\n10\n00:09:06.640 --> 00:09:09.470\nMarcus Verri: who is the dog, and then i'm sleeping over\n"
})
headers = {
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

```

## Response

```
   The part - a chunk - of a larger text:       'text' : textChunk,
   The no of words in a chunk:                  'words' : wordChunk,
   The no of chars in a chunk:                  'size' : textChunk.length,
```

```JSON

{
    {
    "text": {
        "chunks": [
            {
                "text": "\n\n1\n00:08:14.680 --> 00:08:16.430\nMarcus Verri: The\n\n2\n00:08:23.130 --> 00:08:24.510\nMarcus Verri: hey? That's going to hear me.\n\n3\n00:08:24.880 --> 00:08:28.830\nAlex Goulding: Yeah, yeah. All good. Thanks.\n\n4\n00:08:29.420 --> 00:08:31.990\nMarcus Verri: So I'm: a little late before I tell the journey. I mean.\n5\n00:08:32.990 --> 00:08:34.150\nMarcus Verri: you Won't: Believe it.\n6\n00:08:34.720 --> 00:08:35.679\nAlex Goulding: You okay.\n7\n00:08:35.900 --> 00:08:51.300\nMarcus Verri: Yeah. Yeah, All good. But I am. I'm here in London for the event. and my dogs here because you couldn't take her to Spain. So i'm taking a chance to take her with me. And it's a really long journey. So basically i'm really close to the city airport.\n8\n00:08:52.250 --> 00:08:59.950\nMarcus Verri: My dogs close to the city center. So i'm here right now, because we need to get all the documentation sorted so we can cross the border.\n9\n00:09:00.110 --> 00:09:05.250\nMarcus Verri: Oh, Well, I you can drive you, fly or drop. I'm. Car pulling to Paris.\n10\n00:09:06.640 --> 00:09:09.470\nMarcus Verri: who is the dog, and then i'm sleeping over\n",
                "words": 173,
                "size": 1123
            }
        ]
    },
    "words": 173
}
```

## FAQ

When calling the API from curl replace invisible EOL in VTT with `\n` if you call the service from curl (for example on mac using textedit and find and replace).

```bash

curl --location 'localhost:4000/' \
--header 'Content-Type: application/json' \
--data '{"chunking_strategy":"newline",
    "chunk_size":3000,
    "overlap":0,
    "text":"1\n00:08:14.680 --> 00:08:16.430\nMarcus Verri: The\n\n2\n00:08:23.130 --> 00:08:24.510\nMarcus Verri: hey? That'\''s going to hear me.\n\n3\n00:08:24.880 --> 00:08:28.830\nAlex Goulding: Yeah, yeah. All good. Thanks.\n\n4\n00:08:29.420 --> 00:08:31.990\nMarcus Verri: So I'\''m: a little late before I tell the journey. I mean.\n5\n00:08:32.990 --> 00:08:34.150\nMarcus Verri: you Won'\''t: Believe it.\n6\n00:08:34.720 --> 00:08:35.679\nAlex Goulding: You okay.\n7\n00:08:35.900 --> 00:08:51.300\nMarcus Verri: Yeah. Yeah, All good. But I am. I'\''m here in London for the event. and my dogs here because you couldn'\''t take her to Spain. So i'\''m taking a chance to take her with me. And it'\''s a really long journey. So basically i'\''m really close to the city airport.\n8\n00:08:52.250 --> 00:08:59.950\nMarcus Verri: My dogs close to the city center. So i'\''m here right now, because we need to get all the documentation sorted so we can cross the border.\n9\n00:09:00.110 --> 00:09:05.250\nMarcus Verri: Oh, Well, I you can drive you, fly or drop. I'\''m. Car pulling to Paris.\n10\n00:09:06.640 --> 00:09:09.470\nMarcus Verri: who is the dog, and then i'\''m sleeping over\n"
}'

```