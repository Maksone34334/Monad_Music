import React, { useState } from 'react';

/**
 * Основной компонент приложения «Monad Music».
 *
 * Этот компонент отображает список музыкальных треков, позволяет
 * воспроизводить выбранный трек через виджет SoundCloud и
 * предоставляет основные элементы управления вроде загрузки и
 * подключения кошелька. Стили оформлены с использованием
 * tailwindcss — тёмный градиентный фон, карточки треков с
 * эффектом наведения и современные градиентные кнопки.
 */
export default function App() {
  // Список треков для плейлиста. URL‑ы берутся из SoundCloud.
  // При необходимости обновите заголовки и ссылки на свои треки.
  const tracks = [
    {
      id: 1,
      title: 'Flickermood – Forss',
      url: 'https://soundcloud.com/forss/flickermood',
    },
    {
      id: 2,
      title: 'Emoji – Pegboard Nerds',
      url: 'https://soundcloud.com/monstercat/pegboard-nerds-emoji',
    },
    {
      id: 3,
      title: 'Heartbeat – Ephixa & Heartbeat',
      url: 'https://soundcloud.com/monstercat/ephixa-heartbeat',
    },
    {
      id: 4,
      title: 'Runaway – Ace Dangelico',
      url: 'https://soundcloud.com/monstercat/ace-dangelico-runaway',
    },
  ];

  // Состояние, хранящее текущий выбранный трек. По умолчанию — первый в списке.
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);

  // Обработчики событий для кнопок загрузки и подключения кошелька.
  const handleUploadClick = () => {
    // Пока загрузка не реализована, выводим всплывающее сообщение.
    alert('Загрузка в разработке! Скоро будет IPFS интеграция');
  };

  const handleConnectWalletClick = () => {
    // В реальном приложении здесь будет логика подключения кошелька.
    alert('🎉 Кошелек подключен к Monad Testnet!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
      {/* Заголовок */}
      <header className="w-full text-center py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          🎵 Monad Music – Decentralized Music Platform
        </h1>
      </header>

      {/* Основной контент */}
      <main className="w-full max-w-5xl px-4 pb-12">
        {/* Плейлист */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Плейлист</h2>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
            {tracks.map((track) => (
              <li
                key={track.id}
                className={
                  'p-4 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 transition-colors ' +
                  'hover:from-purple-700 hover:to-blue-700'
                }
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                  <span className="font-medium flex-1 pr-4" title={track.title}>
                    {track.title}
                  </span>
                  <button
                    onClick={() => setCurrentTrack(track)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                  >
                    ▶︎ Play
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Активный плеер */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Сейчас играет</h2>
          <div className="p-4 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700">
            <p className="mb-2 font-medium truncate" title={currentTrack.title}>
              {currentTrack.title}
            </p>
            {/* SoundCloud виджет. Используется стандартный URL виджета с параметрами. */}
            <div className="relative pt-[56.25%] overflow-hidden rounded-md">
              <iframe
                title="SoundCloud Player"
                className="absolute top-0 left-0 w-full h-full border-0"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                  currentTrack.url
                )}&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true`}
              />
            </div>
          </div>
        </section>

        {/* Кнопки управления */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleUploadClick}
            className="px-6 py-3 w-full sm:w-auto rounded-lg text-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Upload
          </button>
          <button
            onClick={handleConnectWalletClick}
            className="px-6 py-3 w-full sm:w-auto rounded-lg text-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </main>
    </div>
  );
}