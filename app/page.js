import CinematicHome from '../components/CinematicHome';
import ShowcaseHero from '../components/ShowcaseHero';
import CreativeBridge from '../components/CreativeBridge';

export default function HomePage() {
  return (
    <div className="showcaseStack">
      <ShowcaseHero />
      <CreativeBridge />
      <CinematicHome />
    </div>
  );
}
