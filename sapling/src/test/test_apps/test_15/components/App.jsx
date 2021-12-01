const { Page1: Alias, Page11 } = import('./Page1');
const [Page1of2, Page2of2] = import('./Page2');
import * as namespace from './Wrapper';
import * as LastPage from './Page4';
import * as DefaultExport from './Page5';

export default function Routes() {
  return (
    <div>
      <Alias />
      <Page1of2 />
      <Page2of2 />
      <namespace.Page3_1 />
      <namespace.Page3_2 />
      <LastPage.Page4_1 />
      <LastPage.Page4_2 />
      <DefaultExport />
      <Page11 />
    </div>
  );
}
