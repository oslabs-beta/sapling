/* eslint-disable @typescript-eslint/no-explicit-any */
import { SourceLocation } from '@babel/types';

// based on deprecated babylon parser TokenType
// and up-to-date BaseNode interface in @babel/types
export interface Token {
  [key: string]: Token[keyof Token];
  type: Partial<{
    label: string;
    keyword: 'let' | 'const' | 'var' | 'function' | string | undefined;
    beforeExpr: boolean;
    startsExpr: boolean;
    rightAssociative: boolean;
    isLoop: boolean;
    isAssign: boolean;
    prefix: boolean;
    postfix: boolean;
    binop: null | any;
    updateContext: null | any;
  }>;
  value: string | number;
  start: number | null;
  end: number | null;
  loc: SourceLocation | null;
}
