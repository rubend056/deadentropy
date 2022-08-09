import Nano, {
  ViewDocument,
  DocumentResponseRow,
  DocumentLookupFailure,
} from "./nano"
import "@server/config"
import { DBDoc } from "@root/model_dist/ts/default/doc"
import Babel from '@babel/standalone'
import { cloneDeep } from "lodash"

const design = async (db: DBScope) => {
  const designs: Record<string, Omit<ViewDocument<{}>, "_id">> = {
    note: {
      views: {
        latest: {
          map:  `function(d){
						if(d.type === 'note') 
            {
              emit(d.updated, null)
            }
					}`,
        },
        access: {
          map: `function(d){
            if (d.type === "note") {
              const r = /^(?<owner>[a-z0-9_]{2,})(?: (?<rights>[0-3]{1,2})(?:;(?<users>(?::?[a-z0-9_]{2,})*)(?: (?<urights>[0-3]*))?)?)?$/
              
              const g = d.access && d.access.match(r) ? r.exec(d.access).groups : undefined
              const t = function (...v) {
                const k = v.every(Boolean) ? "_" + v.join("_") : ""
                if (k) emit(k, null)
              }
              t("3", g.owner)
              t(g.rights?.[0])
              g.users?.split(":").forEach((u, i) => t(g.urights?.[i] ?? g.rights?.[1], u))
            }
          }`,
        },
      },
    },
  }

  const k_to_design = (k) => `_design/${k}`
  const designs_db = await db.fetch({
    keys: Object.keys(designs).map(k_to_design),
  })
  // console.log(JSON.stringify(designs_db, undefined, 2))
  const lookupValid = <T extends {}>(
    r: DocumentLookupFailure | DocumentResponseRow<T>
  ): r is DocumentResponseRow<T> => typeof r.error === "undefined"
  // Do a bulk update of designs in the db
  const to_change = designs_db.rows.map((r) => ({
    _id: r.key,
    ...(lookupValid(r) ? r.doc : {}),
    ...Object.entries(designs).find(([k, d]) => k_to_design(k) === r.key)?.[1],
  }))

  const bulk = await db.bulk({
    docs: to_change,
  })

  console.log(
    `Pushed ${to_change.length} designs:`,
    JSON.stringify(to_change, undefined, 2),
    JSON.stringify(bulk, undefined, 2)
  )
}

const couchdb_init = async () => {
  const db_name = process.env.DB_NAME__S

  const db_url = process.env.DB_URL
  if (!db_url || !db_name)
    throw `No  DB_URL:"${db_url}"  or  DB_NAME:"${db_name}"  ?`

  const nano = Nano(db_url)

  const dbs = await nano.db.list()

  const create = !dbs.includes(db_name)
  if (create) await nano.db.create(db_name)

  const db = nano.use<DBDoc>(db_name)
  console.log(
    `DB "${db_name}" ${create ? "created and" : ""} connected successfully!`
  )

  if (create || process.env.APP_DEBUG__S) await design(db)

  return db
}

export type DBScope = Nano.DocumentScope<DBDoc>

export default couchdb_init
