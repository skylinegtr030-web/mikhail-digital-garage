import CinematicHome from '../components/CinematicHome';
import ShowcaseHero from '../components/ShowcaseHero';
import CreativeBridge from '../components/CreativeBridge';
import TransformationLab from '../components/TransformationLab';
import ProcessOverdrive from '../components/ProcessOverdrive';
import CapabilityDetails from '../components/CapabilityDetails';

export default function HomePage() {
  return (
    <div className="showcaseStack">
      <ShowcaseHero />
      <CreativeBridge />
      <TransformationLab />
      <CinematicHome />
      <ProcessOverdrive />
      <CapabilityDetails />
    </div>
  );
}
