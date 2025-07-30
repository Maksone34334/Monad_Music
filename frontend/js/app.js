/*
 * app.js
 *
 * Home page logic for the Pods Music prototype.  This script populates the
 * trending section with placeholder playlists.  In a production build you
 * would fetch data from a backend service or indexer tracking playlist mints.
 */

document.addEventListener('DOMContentLoaded', () => {
  const trendingContainer = document.getElementById('trending');

  // Example data – in a real app this would come from an API or subgraph
  const trendingPlaylists = [
    {
      id: 1,
      title: 'Summer Vibes',
      description: '12 upbeat tracks to keep your summer mood alive.',
      cover: 'https://via.placeholder.com/150',
      collects: 42
    },
    {
      id: 2,
      title: 'Chill Beats',
      description: 'Lo‑fi and chillhop tunes for studying or relaxing.',
      cover: 'https://via.placeholder.com/150',
      collects: 37
    },
    {
      id: 3,
      title: 'Indie Gems',
      description: 'A curated set of indie songs you might have missed.',
      cover: 'https://via.placeholder.com/150',
      collects: 29
    }
  ];

  trendingPlaylists.forEach((playlist) => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = playlist.cover;
    img.alt = playlist.title;
    img.style.width = '100%';
    img.style.borderRadius = '4px';

    const title = document.createElement('h3');
    title.textContent = playlist.title;

    const desc = document.createElement('p');
    desc.textContent = playlist.description;

    const collects = document.createElement('p');
    collects.innerHTML = `<strong>${playlist.collects}</strong> collects`;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(collects);

    trendingContainer.appendChild(card);
  });
});
