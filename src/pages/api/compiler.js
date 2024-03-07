/* Copyright (c) 2024, ARTCOMPILER INC */

import {
  Compiler as BasisCompiler,
  Transformer as BasisTransformer,
} from '@graffiticode/basis';

export class Transformer extends BasisTransformer {
  PROG(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      const err = e0;
      const val = options.data;
      resume(err, val);
    });
  }
}

export const compiler = new BasisCompiler({
  langID: '0011',
  version: 'v0.0.1',
  Transformer: Transformer,
});
