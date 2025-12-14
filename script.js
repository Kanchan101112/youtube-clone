function onYouTubeIframeAPIReady() {
  console.log("YouTube Iframe API Loaded");
}
let api_key = "AIzaSyBsb-Qbs0iF9k8ICdh69UUGKL_AaaeCtKA";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let search_http = "https://www.googleapis.com/youtube/v3/search?";

const videoCardContaier = document.querySelector(".video-container");
const videoPlayerSection = document.getElementById("videoPlayerSection");
const mainVideoContainer = document.getElementById("mainVideoContainer");


let youtubePlayer;

window.addEventListener("load", () => {
  fetchVideos();
});

function fetchVideos() {
  fetch(
    video_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        chart: "mostPopular",
        maxResults: 20,
        regionCode: "IN",
      })
  )
    .then((res) => res.json())
    .then((data) => {
      data.items.forEach((item) => {
        getChannelIcon(item);
      });
    });
}

function getChannelIcon(video) {
  fetch(
    channel_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
      makeVideoCard(video);
    })
    .catch((error) => console.log(error));
}

function makeVideoCard(data) {
  const videoCard = document.createElement("div");
  videoCard.className = "video";

  videoCard.innerHTML = `
    <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="video thumbnail">
    <div class="content">
        <img src="${data.channelThumbnail}" class="channel-icon" alt="channel icon">
        <div class="info">
            <h4 class="title">${data.snippet.title}</h4>
            <p class="channel-name">${data.snippet.channelTitle}</p>
        </div>
    </div>
  `;
  videoCard.addEventListener("click", () => {
    currentVideoData = data;
    openVideoPlayer(data.id);
  });

  videoCardContaier.appendChild(videoCard);
}

function openVideoPlayer(videoId) {
  videoId = String(videoId);
  videoPlayerSection.style.display = "block";
  mainVideoContainer.style.display = "none";

  document.querySelector(".filter").style.display = "none";

  //initialize the youtube player
  if (!youtubePlayer) {
    youtubePlayer = new YT.Player("videoPlayer", {
      height: "500",
      width: "100%",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
      },
    });
  } else {
    youtubePlayer.loadVideoById(videoId);
  }

// console.log(currentVideoData);

  document.getElementById('videoTitle').textContent = currentVideoData.snippet.title;
  document.getElementById('channelIconDetail').src = currentVideoData.channelThumbnail;
  document.getElementById('channelTitleDetail').textContent = currentVideoData.snippet.channelTitle;
  document.getElementById('video-description').textContent = currentVideoData.snippet.description;
}
const searchInput= document.querySelector('.search-bar');
const searchButton= document.querySelector('.search-btn');

searchButton.addEventListener('click', ()=>{
  if(searchInput.value.length){
    //trigger search video function
     searchVideos(searchInput.value);
  }
});
searchButton.addEventListener('keypress', ()=>{
  if(e.key === 'Enter' && searchInput.value.length){
    //trigger search video function
    searchVideos(searchInput.value);
  }
});

function searchVideos(query){

  videoCardContaier.innerHTML= '';

  //reset my UI
  videoPlayerSection.style.display = "none";
  mainVideoContainer.style.display = "grid";
  document.querySelector(".filter").style.display = "flex";

fetch(search_http + new URLSearchParams({
  key: api_key,
  part: 'snippet',
  maxResults: 20,
  q: query,
  type: 'video'
})).then(res => res.json())
.then(data => {
  data.items.forEach(item => {
    let video = {
      id: item.id.videoId,
      snippet: item.snippet
    };
    getChannelIcon(video)
  })
}).catch(err => console.log(err))
}