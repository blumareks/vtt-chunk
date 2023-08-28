# vtt-chunk

## running node

npm install
npm run build
node app.js


## running docker

podman image build . -t <your_dockerhub_name>/<container_name>:tag

podman run -p 4000:4000 <image_name/image_id>
