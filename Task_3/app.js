const videoCardContainer = document.querySelector('.video-container');

let api_key = "AIzaSyBYJv-M14swQJorLvTo6Vg2qIdJrdx5THk";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

fetch(video_http + new URLSearchParams({
    key: api_key,
    part: 'snippet,statistics', 
    chart: 'mostPopular',
    maxResults: 60,
    regionCode: 'IN'
}))
.then(res => res.json())
.then(data => {
    data.items.forEach(item => {
        getChannelIcon(item);
    })
})
.catch(err => console.log(err));

const getChannelIcon = (video_data) => {
    fetch(channel_http + new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: video_data.snippet.channelId
    }))
    .then(res => res.json())
    .then(data => {
        video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
        makeVideoCard(video_data);
    })
}

function formatViewCount(viewCount) {
    if (viewCount >= 1e6) {
        return (viewCount / 1e6).toFixed(1) + 'M';
    } else if (viewCount >= 1e3) {
        return (viewCount / 1e3).toFixed(1) + 'K';
    } else {
        return viewCount.toString();
    }
}

function formatUploadDate(uploadDate) {
    const now = new Date();
    const uploaded = new Date(uploadDate);
    const timeDiff = now - uploaded;
    
    const seconds = Math.floor(timeDiff / 1000);
    if (seconds < 60) {
        return `${seconds} seconds ago`;
    }
    
    const minutes = Math.floor(timeDiff / (1000 * 60));
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    }
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    if (hours < 24) {
        return `${hours} hours ago`;
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    if (days < 7) {
        return `${days} days ago`;
    }
    
    const weeks = Math.floor(days / 7);
    if (weeks < 52) {
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
    
    const years = Math.floor(weeks / 52);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}



const makeVideoCard = (data) => {
    videoCardContainer.innerHTML += `
    <div class="video mb-4" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h6 class="title">${data.snippet.title}</h6>
                <p class="channel-name">${data.snippet.channelTitle}</p>
                <p class="view-count">${formatViewCount(data.statistics.viewCount)} views 
                point	• ${formatUploadDate(data.snippet.publishedAt)}</p>
              
            </div>
        </div>
    </div>
    `;
}

// search bar

const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');
let searchLink = "https://www.youtube.com/results?search_query=";

searchBtn.addEventListener('click', () => {
    if(searchInput.value.length){
        location.href = searchLink + searchInput.value;
    }
})


// ......................
function toggleProfile() {
    var popup = document.getElementById("profilePopup");
    popup.classList.toggle("active");
  }

  