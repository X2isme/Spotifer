import { playlists, stats, friendlyTimes } from './index.js';

const app = document.querySelector('.app');
const playlistEl = document.getElementById('playlist');
const queueEl = document.getElementById('queue');
const statsEl = document.getElementById('stats');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const trackMood = document.getElementById('trackMood');
const trackTime = document.getElementById('trackTime');
const trackProgress = document.getElementById('trackProgress');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');
const mixButton = document.getElementById('mixButton');
const playButton = document.getElementById('playButton');
const skipButton = document.getElementById('skipButton');
const loveButton = document.getElementById('loveButton');

let activePlaylist = playlists[0];
let isPlaying = false;
let progressTimer = null;

const formatPlaylist = (playlist) => {
  const item = document.createElement('div');
  item.className = 'playlist-item';
  item.dataset.id = playlist.id;
  item.innerHTML = `
    <div>
      <strong>${playlist.title}</strong>
      <span>${playlist.description}</span>
    </div>
    <span>${playlist.minutes} min</span>
  `;
  return item;
};

const renderPlaylists = (items) => {
  playlistEl.innerHTML = '';
  items.forEach((playlist) => {
    const item = formatPlaylist(playlist);
    if (playlist.id === activePlaylist.id) {
      item.classList.add('active');
    }
    item.addEventListener('click', () => setActivePlaylist(playlist.id));
    playlistEl.appendChild(item);
  });
};

const renderQueue = (playlist) => {
  queueEl.innerHTML = '';
  playlist.tracks.forEach((track, index) => {
    const row = document.createElement('div');
    row.className = 'queue-item';
    row.innerHTML = `
      <div>
        <strong>${track.title}</strong>
        <small>${track.artist}</small>
      </div>
      <small>${track.duration}</small>
    `;
    if (index === 0) {
      row.style.border = `1px solid ${playlist.color}`;
    }
    queueEl.appendChild(row);
  });
};

const renderStats = () => {
  statsEl.innerHTML = '';
  stats.forEach((stat) => {
    const card = document.createElement('div');
    card.className = 'stat';
    card.innerHTML = `
      <strong>${stat.value}</strong>
      <span>${stat.label}</span>
    `;
    statsEl.appendChild(card);
  });
};

const updateNowPlaying = () => {
  const [track] = activePlaylist.tracks;
  trackTitle.textContent = track.title;
  trackArtist.textContent = `by ${track.artist}`;
  trackMood.textContent = activePlaylist.mood;
  trackTime.textContent = `${track.duration} • ${activePlaylist.minutes} min mix`;
  trackProgress.style.width = isPlaying ? '45%' : '0%';
  playButton.textContent = isPlaying ? 'Pause' : 'Play';
};

const setActivePlaylist = (playlistId) => {
  const selected = playlists.find((playlist) => playlist.id === playlistId);
  if (!selected) return;
  activePlaylist = selected;
  renderPlaylists(playlists);
  renderQueue(activePlaylist);
  updateNowPlaying();
};

const toggleTheme = () => {
  const nextTheme = app.dataset.theme === 'dark' ? 'light' : 'dark';
  app.dataset.theme = nextTheme;
  themeToggle.textContent = nextTheme === 'dark' ? 'Toggle Theme' : 'Switch to Dark';
};

const startMix = () => {
  const random = playlists[Math.floor(Math.random() * playlists.length)];
  setActivePlaylist(random.id);
  isPlaying = true;
  updateNowPlaying();
  playButton.textContent = 'Pause';
  trackProgress.style.width = `${Math.floor(Math.random() * 60) + 20}%`;
};

const togglePlayback = () => {
  isPlaying = !isPlaying;
  updateNowPlaying();
  if (isPlaying) {
    progressTimer = window.setInterval(() => {
      const next = Math.min(100, parseInt(trackProgress.style.width || '0', 10) + 5);
      trackProgress.style.width = `${next}%`;
      if (next >= 100) {
        isPlaying = false;
        updateNowPlaying();
        window.clearInterval(progressTimer);
      }
    }, 800);
  } else if (progressTimer) {
    window.clearInterval(progressTimer);
  }
};

const skipTrack = () => {
  const rotated = [...activePlaylist.tracks.slice(1), activePlaylist.tracks[0]];
  activePlaylist = { ...activePlaylist, tracks: rotated };
  renderQueue(activePlaylist);
  updateNowPlaying();
};

const saveMix = () => {
  loveButton.textContent = 'Saved!';
  loveButton.style.background = 'var(--accent)';
  loveButton.style.color = '#0c111c';
  window.setTimeout(() => {
    loveButton.textContent = 'Save';
    loveButton.style.background = '';
    loveButton.style.color = '';
  }, 1600);
};

searchInput.addEventListener('input', (event) => {
  const term = event.target.value.toLowerCase();
  const filtered = playlists.filter((playlist) =>
    playlist.title.toLowerCase().includes(term) ||
    playlist.description.toLowerCase().includes(term),
  );
  renderPlaylists(filtered);
});

mixButton.addEventListener('click', startMix);
playButton.addEventListener('click', togglePlayback);
skipButton.addEventListener('click', skipTrack);
loveButton.addEventListener('click', saveMix);
themeToggle.addEventListener('click', toggleTheme);

renderPlaylists(playlists);
renderQueue(activePlaylist);
renderStats();
updateNowPlaying();
trackTime.textContent = `${friendlyTimes[0]} • ${activePlaylist.minutes} min mix`;
