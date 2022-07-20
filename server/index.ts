import { note, Prisma, PrismaClient, user } from "@prisma/client"
import cors from "cors"
import crypto from "crypto"
import express from "express"
import fs from "fs"
import http from "http"
import jwt from "jsonwebtoken"
import { pick } from "lodash"
import { env } from "process"
import "./config"
import swagger, { wA } from "./swagger"
import { login_schema, register_schema } from "./types/Auth.schema"
import JwtClaims from "./types/jwt_claims"
import { Note, NotePost, NotePut } from "./types/Notes"
import { validate } from "./utils.yup"

const db = new PrismaClient()
var app = express()
//#region Express Extensions
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.text())
app.use(cors())
app.set("trust proxy", true)
//#endregion
const w = swagger(app)
//#region Response Logger
app.use((req, res, next) => {
  console.log(`Incoming request for ${req.path}, from ${req.ip}`)

  var send = res.send
  //@ts-ignore
  res.send = function (v) {
    if (typeof v === "string")
      console.log(
        `Answering with: ` + v.substring(0, 100) + (v.length > 100 ? "..." : "")
      )
    //@ts-ignore
    send.apply(res, arguments)
  }

  next()
})
//#endregion
//#region GET /time
/** Time ping, for reloading */
const time = new Date()
w(app.get, {
  comment: "Last server startup time",
  output: { time: "milliseconds since epoch" },
})("/time", (req, res) => res.send({ time: time.getTime() }))
//#endregion

//#region GET /
w(app.get, { hide: true })("/", (req, res) => {
  res.redirect("" + "/swagger")
})
//#endregion
//#region GET /pages/:page
// w(app.get, { link: "/pages/index.html", comment: "A static html page" })(
//   "/pages/:page",
//   (req, res) => {
//     res.send(fs.readFileSync(`./pages/${req.params.page}`).toString());
//   }
// );
//#endregion
//#region GET Server Management
w(app.get, { comment: "Where actions on webserver are controlled" })(
  "/manage",
  (req, res) => {
    switch (req.query?.action) {
      case "hello":
        res.send("Hello back!")
        break
      default:
        if (typeof req.query?.action !== "undefined")
          return res.status(400).send("Action not supported")
        return res.send(`
			<script>
				const t = (e) => {
					e.target.disabled = true;
					const le = document.getElementById("loading");
					const re = document.getElementById("response");
					
					le.style.display = '';
					fetch('${
            process.env.APP_PREFIX ? "/" + process.env.APP_PREFIX : ""
          }/manage?action='+e.target.id)
					.then(r=>{if(!r.ok)throw r.statusText;return r.text()})
					.then(r=>{
						re.classList.remove("error");
						re.innerHTML = r;
					})
					.catch((e) => {re.classList.add("error");re.innerHTML = e;})
					.finally(()=>{e.target.disabled=false;le.style.display = 'none';})
				}
			</script>
			<style>
				.counter-border{
					position: absolute;
					top:0;right:0;width:40px;height:40px;margin:10px;
					border-radius: 999px;
					border: 2px dashed rgba(0,0,0,.5);
					animation: rotate 20s linear infinite, appear 1s forwards;
				}
				@keyframes rotate{
					from{transform: rotate(0deg);}
					to{transform: rotate(360deg);}
				}
				@keyframes appear{
					from{opacity: 0;}
					to{opacity: 1;}
				}
				
				.response{
					color:blue;
				}
				.response.error{
					color: red;
				}
			</style>
			<h1>Settings</h1>
			<div class="counter-border" style="display:none" id="loading"></div>
			
			<h2>Action Response</h2>
			<div id="response" class="response"></div>
			
			<h2>Actions</h2>
			<button id="hello" onclick="t(event)">Hello</button>
			
			`)
    }
  }
)
//#endregion

//#region Controllers
// fs.mkdirSync("./data", { recursive: true });
// let [notes, setNotes] = fileData<Note[]>("./data/notes.json", []);
// const notes_controller = {
//   get: (id?: string) => (id ? notes.find((_n) => _n.id === id) : notes),
//   put: (id: string, n: NotePut) => {
//     n = cloneDeep(n);
//     const i = notes.findIndex((_n) => _n.id === id);
//     if (i < 0) throw "Couldn't find note id " + id;
//     notes[i] = { ...notes[i], ...pick(n, noteModifyAllowed) };

//     setNotes(notes);
//     return id;
//   },
//   post: (n: NotePost) => {
//     n = cloneDeep(n);
//     const note: Note = {
//       name: "",
//       type: "text",
//       ...pick(n, noteModifyAllowed),
//       id: id_gen(),
//       created: Date.now(),
//     };
//     notes.push(note);
//     setNotes(notes);
//     return note.id;
//   },
//   delete: (ids: string[]) => {
//     notes = notes.filter((n) => !ids.includes(n.id));
//     setNotes(notes);
//     return ids;
//   },
// };
//#endregion

//#region ------------------- ENDPOINTS -----------------------
//#region Auth

const pass = (pass: string, salt: Buffer) =>
  crypto.pbkdf2Sync(pass, salt, 1000, 64, `sha512`)
const pass_is_valid = (user: user, _pass?: string) =>
  !(user.pass
    ? !_pass || (user.salt && pass(_pass, user.salt).compare(user.pass) !== 0)
    : false)
w(app.post, {
  input: `user: string
pass: string (the new password)
code|prev: string (email code or previous password)`,
})(
  "/reset",
  wA(async (req, res) => {
    const b = validate(register_schema, req.body)
    if (!b) throw "\\input"
    if (!b.user || !b.pass) throw "\\input"

    const user = await db.user.findFirst({
      where: { user: b.user, enabled: true },
    })
    if (!user) throw "User not found"
    if (!user.salt) user.salt = crypto.randomBytes(16)

    // Check password
    if (!pass_is_valid(user, b.prev)) throw 401
    // Set new pass
    user.pass = pass(b.pass, user.salt)
    // Update DB User
    await db.user.update({ where: { id: user.id }, data: user })

    res.sendStatus(200)
  })
)

const secret =
  (fs.existsSync("./secret.txt") && fs.readFileSync("./secret.txt")) ||
  "hmEGEwiaeVDZZnDgTK3G" + (env.NODE_ENV === "development" ? "" : Date.now())

w(app.post, { input: login_schema.describe().fields })(
  "/login",
  wA(async (req, res) => {
    const b = validate(login_schema, req.body)
    if (!b || !b.user) throw "\\input"

    const user = await db.user.findFirst({ where: { user: b.user } })
    if (!user) throw "User not found"
    const payload: JwtClaims = pick(user, "user", "id")
    const token = jwt.sign(payload, secret, { expiresIn: "1w" })

    // Check password
    if (!pass_is_valid(user, b.pass)) throw 401

    if (!user.pass) console.log(`WARNING: No user pass, logging in 'user:${user.user}'`)

    res.send(token)
  })
)
//#endregion

//#region Notes Public
w(app.get, {
  comment: `Public Notes (they don't need authentication, but they have to be marked public by having an entry with id_user:null in note_access )`,
})(
  "/notes/:id",
  wA(async (req, res, next) => {
    const nid = req.params.id
    const note_access = await db.note_access.findFirst({
      where: { id_base: nid, id_user: null, access_level: { lte: 1, gte: 0 } },
      include: { note: true },
    })
    if (!note_access) next()
    res.send(note_access?.note)
  })
)
//#endregion

//#region Auth Validator
app.use((req, res, next) => {
  const token = req.headers.authorization?.match(
    /^bearer ([\w\-]+\.[\w\-]+\.[\w\-]+)/i
  )?.[1]
  if (!token) throw "Not valid 'authorization' header"
  // console.log("Verifying token:", token, " with secret: ", secret);
  res.locals.jwt = jwt.verify(token, secret)
  next()
})
const resJwt = (res) => res.locals.jwt as JwtClaims
//#endregion

//#region Notes
w(app.get, { link: "/notes" })(
  "/notes/:id?",
  wA(async (req, res) => {
    const nid = req.params.id
    const user = await db.user.findUnique({
      where: { id: resJwt(res).id },
      include: {
        note: nid ? { where: { id: nid } } : true,
        note_access: {
          include: { note: true },
          where: { access_level: { not: null }, id_base: nid || undefined },
        },
      },
    })
    if (!user) throw "No user found"
    const notes = [...user.note, ...user.note_access.map((v) => v.note)]
    if (!notes.length) throw "No notes found"
    res.send(
      nid
        ? notes[0]
        : notes.sort((a, b) =>
            Number(b.updated.getTime() - a.updated.getTime())
          )
    )
  })
)
w(app.put)(
  "/notes/:id",
  wA(async (req, res) => {
    let n = Prisma.validator<Prisma.noteUpdateInput>()(req.body)
    n = await db.note.update({
      where: { id: req.params.id },
      data: { ...n, updated: BigInt(Math.floor(Date.now() / 1000)) },
    })
    res.send(n)
  })
)
w(app.post)(
  "/notes",
  wA(async (req, res) => {
    const n_post = req.body as NotePost
    let n = await db.note.create({
      data: { ...n_post, createdBy: resJwt(res).id },
    })
    res.send(n)
  })
)
w(app.delete)(
  "/notes/:id?",
  wA(async (req, res) => {
    const ids = (req.params.id ? [req.params.id] : req.body) as
      | string[]
      | undefined
    if (!Array.isArray(ids)) throw "\\input"

    await db.note.deleteMany({ where: { id: { in: ids } } })

    res.sendStatus(200)
  })
)
//#endregion
//#endregion

//#region Error handler
const error_alias = {
  "\\input":
    "Input formatting received for this endpoint is wrong, check swagger.",
}
app.use((err, req, res, next) => {
  switch (typeof err) {
    case "number":
      console.error(`Sending code ${err}`)
      res.sendStatus(err)
      break
    default:
      console.error(err)
      res.status(500)
      if (typeof err === "string") {
        res.set("Content-Type", "text/plain")
        res.send(error_alias[err] ?? err)
      } else {
        res.send(err)
      }
  }
})
//#endregion

//#region Serve the app

// Create an HTTP service.
http
  .createServer(app)
  .listen(
    Number(process.env.SERVER_HTTP_PORT),
    process.env.SERVER_HOSTNAME,
    () => console.log(`App listening on port ${process.env.SERVER_HTTP_PORT}`)
  )
// Create an HTTPS service identical to the HTTP service.
// var https_options = {
//   key: fs.readFileSync(
//     // "./data/final_final/dls-innovation.com.key"
//     "./certs/anty.dev/cert.key"
//   ),
//   cert: fs.readFileSync(
//     // "./data/final_final/dls-innovation.com.pem"
//     "./certs/anty.dev/cert.crt"
//   ),
// };
// https
//   .createServer({}, app)
//   .listen(https_port, () => console.log(`App listening on port ${https_port}`));
//#endregion
