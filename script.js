function onYouTubeIframeAPIReady() {
  console.log("YouTube Iframe API Loaded");
}
let api_key = "AIzaSyCTBI0W7IC2hFOrv41_Z-onaiqddxi8ZPQ";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

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
