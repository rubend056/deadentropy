import { PrismaClient } from "@prisma/client"
import _g from "casual"

const g = _g as Casual.Generators & Casual.Casual & Casual_Custom

interface Casual_Custom {
  n: <T>(v?: T) => T | null
  u: <T>(v?: T) => T | undefined
  nu: <T>(v?: T) => T | null | undefined
  str: (s?: string) => string
}
g.define("n", (v?) => g.random_element([v, null]))
g.define("u", (v?) => g.random_element([v, undefined]))
g.define("nu", (v?) => g.random_element([v, null, undefined]))
g.define("str", (s?: string) => g.random_element([s ?? g.string, ""]))

const db = new PrismaClient()


async function main() {
  await Promise.all(
    new Array(20).fill(0).map((v, i) =>
      db.user.create({
        data: {
          user: g.username,
          pass: g.nu(Buffer.from(g.string)),
          profile: g.u({ create: { name: g.str(g.name) } }),
          enabled: g.u(g.coin_flip.valueOf()),
          salt: g.nu(Buffer.from(g.string)),
        },
      })
    )
  )
}

main()
  .catch((e: Error) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
