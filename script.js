const audio = document.getElementById("audio");
const audioSource = document.getElementById("audioSource");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSong = 0;
let isPlaying = false;

// Playlist
const songs = [
    { title: "Gal sun", artist: "Artist 1", src: "songs/Gal sun.mp4" },
    { title: "Sajni", artist: "Artist 2", src: "songs/Sajni.mp4" },
    { title: "Tabdali ayi hai", artist: "Artist 3", src: "songs/Tabdali ayi hai.mp4" }
];

// Load Song
function loadSong(index) {
    audioSource.src = songs[index].src;
    audio.load();
    title.textContent = songs[index].title;
    artist.textContent = songs[index].artist;
}

// Play / Pause
function playPause() {
    if (!isPlaying) {
        audio.play();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Next Song
function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Previous Song
function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Update Progress
audio.addEventListener("timeupdate", () => {
    if (!isNaN(audio.currentTime) && !isNaN(audio.duration)) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

// Seek
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});

// Volume
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

// Format Time
function formatTime(time) {
    if (isNaN(time)) return "0:00";
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

// Autoplay next song
audio.addEventListener("ended", nextSong);

// Button event listeners
playBtn.addEventListener("click", playPause);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Load first song initially
loadSong(currentSong);