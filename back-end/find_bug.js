function find_bug(req, res) {
  res.json({
    result: [
      {
        from: {
          row: 0,
          column: 1,
        },
        to: {
          row: 0,
          column: 2,
        }
      },
      {
        from: {
          row: 0,
          column: 4,
        },
        to: {
          row: 0,
          column: 5,
        }
      },
      {
        from: {
          row: 0,
          column: 7,
        },
        to: {
          row: 0,
          column: 8,
        }
      }
    ],
  });
}

module.exports = find_bug;
