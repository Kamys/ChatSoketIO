/* eslint-disable no-undef */
const dbs = db.getMongo().getDBNames()
for (const i in dbs) {
  db = db.getMongo().getDB(dbs[i])
  print('dropping db ' + db.getName())
  db.dropDatabase()
}
