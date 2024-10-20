// create loading screen component to show when loading data from react-spinner
import { useRive } from 'rive-react';
import loader from './loading-dots.riv';

const LoaderDots = () => {
  const { RiveComponent } = useRive({
    src: loader,
    autoplay: true,

  });

  return (
    <div className='w-20 h-20'>
        <RiveComponent />
    </div>
  );
}

export default LoaderDots;