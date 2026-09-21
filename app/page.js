import CinematicHome from '../components/CinematicHome';
import ShowcaseHero from '../components/ShowcaseHero';

export default function HomePage() {
  return (
    <div className="showcaseStack">
      <ShowcaseHero />
      <CinematicHome />
    </div>
  );
}
