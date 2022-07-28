import Nano from "nano"

const db = (async () => {
  const db_name = process.env.DB_NAME__S

  const db_url = process.env.DB_URL
  if (!db_url || !db_name)
    throw `No  DB_URL:"${db_url}"  or  DB_NAME:"${db_name}"  ?`

  const nano = Nano(db_url)

  const dbs = await nano.db.list()

  const create = !dbs.includes(db_name)
  if (create) await nano.db.create(db_name)

  const db = nano.use(db_name)
	
  console.log(
    `DB "${db_name}" ${create ? "created" : "connected"} successfully!`
  )
  return db
})()

export default db
