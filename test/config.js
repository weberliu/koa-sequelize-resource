const db = process.env.NODE_ENV == 'travis' 
              ? "tester:tester@localhost"
              : "root:123456@localhost:32775"

export default db              