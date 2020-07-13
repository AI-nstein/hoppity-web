const { exec } = require("child_process");
const fs = require("fs");
const crypto = require('crypto');
const parse = require("shift-parser").parseModule;

const STORAGE_BASE = "/home/liby99/projects/hoppity-storage/";
const BEST_MODEL_CKPT = "/home/edinella/best-model.ckpt";
const VOCAB_FIXES_NPY = "/home/edinella/vocab_fixes.npy";
const TYPE_VOCAB_PKL = "/home/edinella/type_vocab.pkl";
const CWD = "/home/liby99/projects/webpage_codegraph_transform/gtrans/eval/"

function find_bug(req, res) {
  const { code } = req.body;
  const filehash = crypto.createHash("md5").update(code).digest("hex"); // temporary file name
  const filename = `${filehash}.js`;
  const file_dir = STORAGE_BASE + filename;

  fs.writeFile(file_dir, code, (err) => {
    if (err) {
      console.log("cannot create temporary file");
      console.log(err);
      res.json({ code: 1, msg: "Cannot create temporary file" });
    } else {
      let ast;
      try {
        ast = parse(code);
      } catch (ex) {
        console.log("Cannot parse AST");
        console.log(err);
        res.send({ code: 3, msg: "Cannot parse AST" });
        return;
      }
      const ast_dir = STORAGE_BASE + filehash + ".json";
      fs.writeFile(ast_dir, JSON.stringify(ast), (err) => {
        if (err) {
          console.log("Cannot save AST json file");
          console.log(err);
          res.send({ code: 4, msg: "Cannot save AST file" });
        } else {
          exec(`python3 predict.py ${BEST_MODEL_CKPT} ${VOCAB_FIXES} ${TYPE_VOCAB_PKL} ${ast_dir} ${file_dir} -ast_fmt shift_node`, {
            cwd: CWD,
          }, (err, stdout, stderr) => {
            if (err) {
              console.log("Cannot run prediction");
              console.log(err);
              console.log(stderr);
              res.send({ code: 5, msg: "Cannot run prediction" });
            } else {
              // console.log(stderr);
              const result = JSON.parse(stdout.split('\n')[4]);
              res.json({ content: result });
            }

            // Delete the generated files
            fs.unlink(file_dir, () => {
              fs.unlink(ast_dir, () => {
                // do nothing
              })
            })
          })
        }
      });
    }
  });
}

function find_bug_test(req, res) {
  res.json([{
    "op": "add_node",
    "loc": [{
      "start": { "line": 0, "column": 0, "offset": 2116 },
      "end": { "line": 0, "column": 3, "offset": 2140 }
    }],
    "value": "False",
    "type": "LiteralBooleanExpression",
    "ch_rank": 1
  }, {
    "op": "add_node",
    "loc": [{
      "start": { "line": 1, "column": 4, "offset": 2116 },
      "end": { "line": 1, "column": 6, "offset": 2140 }
    }],
    "value": "True",
    "type": "LiteralBooleanExpression",
    "ch_rank": 1
  }, {
    "op": "add_node",
    "loc": [{
      "start": { "line": 2, "column": 7, "offset": 722 },
      "end": { "line": 2, "column": 9, "offset": 745 }
    }],
    "value": "20",
    "type": "LiteralNumericExpression",
    "ch_rank": 2
  }]);
}

module.exports = {
  find_bug,
  find_bug_test,
};
