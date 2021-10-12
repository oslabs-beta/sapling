const Page1 = lazy(() => import('./Page1'));
import Page2 from './Page2';
const Page3 = import('./Page3');

export default function Routes() {
  return (
        <div>
          <Page1 />
          <Page2 />
          <Page3 />
        </div>
  );
}