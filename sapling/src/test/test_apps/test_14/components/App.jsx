const { Page1: Alias, Page11 } = import('./Page1');
const [Page1of2, Page2of2] = import('./Page2');
const Page3 = import('./Page3');

export default async function Routes() {
  const { Page4_1, Page4_2 } = Promise.resolve(import('./Page4'));
  const Page5 = await import('./Page5');
  return (
    <div>
      <Alias />
      <Page11 />
      <Page1of2 />
      <Page2of2 />
      <Page3 />
      <Page4_1 />
      <Page4_2 />
      <Page5 />
    </div>
  );
}
