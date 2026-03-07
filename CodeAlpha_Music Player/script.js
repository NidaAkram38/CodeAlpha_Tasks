const songs = [
  { title: "Gal Sun",             artist: "Sabat Batin",       src: "https://res.cloudinary.com/dsv3voob3/video/upload/v1772886240/Gal_sun_fskgdl.m4a" },
  { title: "Love Me Like You Do", artist: "Ellie Goulding",    src: "https://res.cloudinary.com/dsv3voob3/video/upload/v1772887279/Love_me_like_you_do_qie7iz.m4a" },
  { title: "Hum",                 artist: "Murtaza Qizilbash", src: "https://res.cloudinary.com/dsv3voob3/video/upload/v1772887281/Hum_zqvnlz.m4a" },
  { title: "Sajni",               artist: "Strings",           src: "https://res.cloudinary.com/dsv3voob3/video/upload/v1772886249/Sajni_lwlkfq.m4a" },
  { title: "Yaariyan",            artist: "Mohan Kannan",      src: "https://res.cloudinary.com/dsv3voob3/video/upload/v1772887286/Yaariyan_szxzde.m4a" },
  { title: "Doroon Doroon",       artist: "Paresh Pahuja",     src: "https://res.cloudinary.com/dsv3voob3/video/upload/v1772887279/Dooron_Dooron_mr9foc.m4a" },
  { title: "Ore Naal",            artist: "Sanah Moidutty",    src: "https://res.cloudinary.com/dsv3voob3/video/upload/v1772887277/Ore_naal_fbhtcb.m4a" },
];

// Supports .mp3, .mp4, .m4a — all work with the HTML5 Audio API
const audio = new Audio();
audio.volume = 0.65;
audio.preload = "metadata";

let currentIndex = 0;
let isPlaying    = false;

const songTitle     = document.getElementById('songTitle');
const songArtist    = document.getElementById('songArtist');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl   = document.getElementById('totalTime');
const playBtn       = document.getElementById('playBtn');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const progressTrack = document.getElementById('progressTrack');
const progressFill  = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const volumeTrack   = document.getElementById('volumeTrack');
const volumeFill    = document.getElementById('volumeFill');
const volumeThumb   = document.getElementById('volumeThumb');
const vinyl         = document.getElementById('vinyl');
const needle        = document.getElementById('needle');
const playlistList  = document.getElementById('playlistList');

function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function buildPlaylist() {
  playlistList.innerHTML = '';
  songs.forEach((song, i) => {
    const li = document.createElement('li');
    li.className = 'playlist-item' + (i === currentIndex ? ' active' : '');
    li.dataset.index = i;
    li.innerHTML = `
      <div class="playlist-index">${i + 1}</div>
      <div class="eq-bars"><span></span><span></span><span></span></div>
      <div class="playlist-details">
        <div class="playlist-title">${song.title}</div>
        <div class="playlist-artist-name">${song.artist}</div>
      </div>
      <div class="playlist-duration">--:--</div>
    `;
    li.addEventListener('click', () => {
      if (currentIndex === i) { togglePlay(); }
      else { loadSong(i, true); }
    });
    playlistList.appendChild(li);
  });
}

function loadSong(index, autoPlay = false) {
  currentIndex   = index;
  audio.src      = songs[index].src;
  audio.load();

  songTitle.classList.remove('fade-in');
  void songTitle.offsetWidth;
  songTitle.classList.add('fade-in');
  songTitle.textContent  = songs[index].title;
  songArtist.textContent = songs[index].artist;

  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent   = '--:--';
  updateProgressUI(0);
  updatePlaylistUI();

  if (autoPlay) {
    audio.play().then(() => { isPlaying = true; setPlayingState(true); })
                .catch(err => console.warn('Autoplay blocked:', err));
  }
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    setPlayingState(false);
  } else {
    audio.play().then(() => { isPlaying = true; setPlayingState(true); })
                .catch(err => console.warn('Play error:', err));
  }
}

function setPlayingState(playing) {
  playBtn.querySelector('.icon-play').style.display  = playing ? 'none'  : 'block';
  playBtn.querySelector('.icon-pause').style.display = playing ? 'block' : 'none';
  vinyl.classList.toggle('spinning', playing);
  needle.classList.toggle('playing', playing);
  updatePlaylistUI();
}

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
  const li = playlistList.children[currentIndex];
  if (li) li.querySelector('.playlist-duration').textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  updateProgressUI(pct);
});

audio.addEventListener('ended', () => {
  isPlaying = false;
  setPlayingState(false);
  setTimeout(() => loadSong((currentIndex + 1) % songs.length, true), 500);
});

audio.addEventListener('error', () => {
  totalTimeEl.textContent = 'File not found';
  console.error('Could not load:', songs[currentIndex].src);
});

function updateProgressUI(pct) {
  const p = Math.min(pct || 0, 100);
  progressFill.style.width = p + '%';
  progressThumb.style.left = p + '%';
}

function seekFromEvent(e) {
  if (!audio.duration) return;
  const rect = progressTrack.getBoundingClientRect();
  const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const pct  = Math.max(0, Math.min(1, x / rect.width));
  audio.currentTime = pct * audio.duration;
}

let draggingProgress = false;
progressTrack.addEventListener('mousedown',  e => { draggingProgress = true; seekFromEvent(e); });
document.addEventListener('mousemove',       e => { if (draggingProgress) seekFromEvent(e); });
document.addEventListener('mouseup',         () => { draggingProgress = false; });
progressTrack.addEventListener('touchstart', e => { draggingProgress = true; seekFromEvent(e); }, { passive: true });
document.addEventListener('touchmove',       e => { if (draggingProgress) seekFromEvent(e); }, { passive: true });
document.addEventListener('touchend',        () => { draggingProgress = false; });

function setVolumeFromEvent(e) {
  const rect = volumeTrack.getBoundingClientRect();
  const x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const pct  = Math.max(0, Math.min(1, x / rect.width));
  audio.volume = pct;
  volumeFill.style.width = (pct * 100) + '%';
  volumeThumb.style.left = (pct * 100) + '%';
}

let draggingVolume = false;
volumeTrack.addEventListener('mousedown',  e => { draggingVolume = true; setVolumeFromEvent(e); });
document.addEventListener('mousemove',     e => { if (draggingVolume) setVolumeFromEvent(e); });
document.addEventListener('mouseup',       () => { draggingVolume = false; });
volumeTrack.addEventListener('touchstart', e => { draggingVolume = true; setVolumeFromEvent(e); }, { passive: true });
document.addEventListener('touchmove',     e => { if (draggingVolume) setVolumeFromEvent(e); }, { passive: true });
document.addEventListener('touchend',      () => { draggingVolume = false; });

function updatePlaylistUI() {
  document.querySelectorAll('.playlist-item').forEach((li, i) => {
    li.classList.toggle('active',     i === currentIndex);
    li.classList.toggle('is-playing', i === currentIndex && isPlaying);
  });
}

prevBtn.addEventListener('click', () => loadSong((currentIndex - 1 + songs.length) % songs.length, isPlaying));
nextBtn.addEventListener('click', () => loadSong((currentIndex + 1) % songs.length, isPlaying));
playBtn.addEventListener('click', togglePlay);

document.addEventListener('keydown', e => {
  if (e.code === 'Space')      { e.preventDefault(); togglePlay(); }
  if (e.code === 'ArrowRight') loadSong((currentIndex + 1) % songs.length, isPlaying);
  if (e.code === 'ArrowLeft')  loadSong((currentIndex - 1 + songs.length) % songs.length, isPlaying);
});

buildPlaylist();
loadSong(0, false);
