const { exec } = require("child_process");
const fs = require("fs");
const crypto = require('crypto');

function find_bug(req, res) {
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

function find_bug_new(req, res) {
  const filehash = crypto.createHash("md5").digest("hex");
  const filename = `${filehash}.js`;
  const file_dir = `/home/liby99/projects/hoppity-storage/${filename}`;
  const { code } = req.body;
  fs.writeFile(file_dir, code, (err) => {
    if (err) {
      res.json({ code: 1, msg: "Cannot create temporary file" });
    } else {

      exec(`python3 predict.py /home/edinella/best-model.ckpt /home/edinella/vocab-fixes.npy /home/edinella/type-vocab.pkl buggy.json ${file_dir} -ast_fmt shift_node`, {
        cwd: "/home/edinella/webpage_codegraph_transform/gtrans/eval/",
      }, (err, stdin, stdout) => {
        
      })
    }
  });  
}

module.exports = find_bug;
