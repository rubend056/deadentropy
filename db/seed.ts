import { PrismaClient } from "@prisma/client"
import g from '@root/utils/casual'

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
