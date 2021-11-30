    let children: Array<ChildInfo> = [];
    let ast: ASTNode | Record<string, Array<Token>>;
  private getImports(body: Array<ASTNode>): Record<string, ImportData> {
      .reduce((accum: Record<string, ImportData>, declaration) => {
  private parseImportDeclaration(declaration: ImportDeclaration): Record<string, ImportData> {
    const output: Record<string, ImportData> = {};
  private parseVariableDeclaration(declaration: VariableDeclaration): Record<string, ImportData> {
    const output: Record<string, ImportData> = {};
    imports: Record<string, ImportData>,
    astToken: Token,
    props: Record<string, boolean>,
    parent: Tree,
    children: Record<string, Tree>
  ): Record<string, Tree> {
    astTokens: Array<Token>,
    imports: Record<string, ImportData>,
    let childNodes: Record<string, Tree> = {};
    let props: Record<string, boolean> = {};
  private getJSXProps(astTokens: Array<Token>, j: number): Record<string, boolean> {
    const props: Record<string, boolean> = {};
  private checkForRedux(astTokens: Array<Token>, imports: Record<string, ImportData>): boolean {
