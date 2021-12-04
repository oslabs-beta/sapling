const { Page1: Alias, Page11 } = require('./Page1');
const [Page1of2, Page2of2] = require('./Page2');
const page = require('./Page3');

export default function Routes() {
  return (
    <div>
      <Alias />
      <Page11 />
      <Page1of2 />
      <Page2of2 />
      <page.Page3 />
    </div>
  );
}
