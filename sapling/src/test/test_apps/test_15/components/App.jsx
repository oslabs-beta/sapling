const { PageA1: Alias, PageA2 } = import('./PageA');
const [PageB1, PageB2] = import('./PageB');

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
