const { exec } = require("child_process");
const fs = require("fs");
const crypto = require('crypto');
const parse = require("shift-parser").parseModule;

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

const STORAGE_BASE = "/home/liby99/projects/hoppity-storage/";

function find_bug(req, res) {
  const { code } = req.body;
  const filehash = crypto.createHash("md5").update(code).digest("hex");
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
          exec(`python3 predict.py /home/edinella/best-model.ckpt /home/edinella/vocab_fixes.npy /home/edinella/type_vocab.pkl ${ast_dir} ${file_dir} -ast_fmt shift_node`, {
            cwd: "/home/liby99/projects/webpage_codegraph_transform/gtrans/eval/",
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
          })
        }
      });
    }
  });

  /*
      const babeled_filename = `${filehash}.babel.js`;
      const babeled_file_dir = STORAGE_BASE + babeled_filename;
      exec(`npx babel --presets=@babel/react ${file_dir}`, {
        cwd: "/home/liby99/projects/hoppity-web/back-end",
      }, (err, stdin, stdout) => {
        if (err) {
          res.json({ code: 2, msg: "Cannot use babel to process file" });
        } else {
          // stdout is the babeled file
          console.log(stdout);
          const ast = parse(stdout);
          console.log(ast);


          find_bug_test(req, res);
        }
      });
    }
  });  
  */
}

module.exports = {
  find_bug,
  find_bug_test,
};
