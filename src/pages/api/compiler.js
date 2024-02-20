/* Copyright (c) 2023, ARTCOMPILER INC */
import {
  Checker as BasisChecker,
  Transformer as BasisTransformer,
  Compiler as BasisCompiler
} from '@graffiticode/basis';

export class Checker extends BasisChecker {
  HELLO(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      const err = [];
      const val = node;
      resume(err, val);
    });
  }
}

export class Transformer extends BasisTransformer {
  HELLO(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      console.log("HELLO() v=" + JSON.stringify(v, null, 2));
      const err = [];
      const val = {
        hello: v0,
      };
      resume(err, val);
    });
  }

  PROG(node, options, resume) {
    console.log("PROG() options=" + JSON.stringify(options, null, 2));
    this.visit(node.elts[0], options, async (e0, v0) => {
      const err = e0;
      const val = v0.pop();
      resume(err, {
        ...val,
        ...options.data,
      });
    });
  }
}

export const compiler = new BasisCompiler({
  langID: '0011',
  version: 'v0.0.1',
  Checker: Checker,
  Transformer: Transformer,
});
