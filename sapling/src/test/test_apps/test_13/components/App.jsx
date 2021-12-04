import * as React from 'react';

const Page1 = React.lazy(() => import('./Page1'));
import Page2 from './Page2';

export default function Routes() {
  return (
    <div>
      <Page1 />
      <Page2 />
    </div>
  );
}
