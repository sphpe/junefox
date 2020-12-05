import config from '../config'
const thumb = config.thumb
const imageServer = config.imageServer

function parseFilename(filename) {
  let arr = filename.split(".")[0].split("_");
  return parseInt(arr[1] || arr[0]);
};

function getImageServer(imageId) {
  return imageServer;
};

function getVideoServer(imageId) {
  return imageServer;
};

function getImage (imageId,size) {
  if (!imageId) return thumb;  
  if (imageId.indexOf("data:image") === 0 || imageId.indexOf("http") === 0) {
    return imageId;
  }
  return [
    getImageServer(imageId), 
    "img",
    imageId[0],
    imageId[1]+imageId[2],
    imageId, 
    size+".png"
  ].join("/");
}

function getVideo (id,size) {
  if (!id) return thumb;  
  if (id.indexOf("data:video") === 0 || id.indexOf("http") === 0) {
    return id;
  }
  return [
    getVideoServer(id), 
    "video",
    id[0],
    id[1]+id[2],
    id, 
    size+".mp4"
  ].join("/");
}

function getAvatar (user,size) {
  return user.avatar ? getImage(user.avatar,size,user.id) : thumb;
}

export { getAvatar, getImage, getVideo }