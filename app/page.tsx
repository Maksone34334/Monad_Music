import Hero from "@/components/hero";
import { Features } from "@/components/features";
import TrendingPlaylists from "@/components/trending-playlists";
import App from "@/components/App";

/**
 * Главная страница проекта Monad Music.
 *
 * Здесь собираются основные секции сайта (Hero, Features, TrendingPlaylists)
 * и подключается компонент App, который воспроизводит треки SoundCloud.
 */
export default function HomePage() {
  return (
    <>
      {/* Верхний блок с описанием проекта */}
      <Hero />
      {/* Секция с преимуществами платформы */}
      <Features />
      {/* Блок с трендовыми плейлистами */}
      <TrendingPlaylists />
      {/* Наш новый плеер SoundCloud */}
      <App />
    </>
  );
}
