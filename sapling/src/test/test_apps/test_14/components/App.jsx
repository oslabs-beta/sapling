const { PageA1: Alias, PageA2 } = require('./PageA');
const [PageB1, PageB2] = require('./PageB');

export default function Routes() {
  return (
    <div>
      <Alias />
      <PageA2 />
      <PageB1 />
      <PageB2 />
    </div>
  );
}
