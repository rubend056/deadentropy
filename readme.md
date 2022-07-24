<div style="text-align:center">

# AppStack

This Template should compile into a server.js NodeJS app that serves the ReactJS WebApp static files as well as functioning as the API of the application.

Bundling a Full-Stack Application that includes API/WebApp/DB along with unit/integration tests, and their respective documentation. 

Point is a developer only needs to execute `yarn compose` to have Server/DB ready to answer on local machine.

My goal is to create the simplest template imaginable while also utilizing powerful and carefully picked concepts/libraries.

I imagine the test of time will let me know what works and what doesn't but I plan to do the most research and only include the reasonable bits.

---

## The fight for a reasonable DBMS
I've been in the DB search for more than a year now and I think I've hit a milestone tonight.

Initially PostgresSQL/Prisma was implemented, but it's incredibly messy to manage RDBMS's, it's that R right before the DBMS that fucks up things, so after much deliberation a decision on CouchDB was made [Comparison](https://db-engines.com/en/system/ArangoDB%3BCouchDB%3BCouchbase%3BRethinkDB). 

Deciding that HTTP's resource based query language + the eventual consistency of CouchDB + CouchDB's unmatched documentation make it a clear winner as a future proof DBMS.

This gives your API a range of control it wouln't otherwise have, control over data structure that simplifies every headache a relational system has, the Relational SQL Black Box is broken as soon as you realize it's a (Data Handling + Relational service). If you only needed the Data handling part and wanted explicit control over the Relational that's where the other DB's (like CouchDB) come in.

**KISS is the definition of future proof concepts**

---

## TODO

</div>


- Main
  - [ ] Main Page (Short intro into the App's purpose)
    - [ ] Docs Main -> (Api/UI docs for developers)
  - [x] Docker
    - [x] Image Server    -> (App is packaged into an image)
    - [x] Image DB        -> (DB is packaged into an image)
    - [x] Compose Develop -> (App is spun up, along with DB with Docker Compose)

- Server (Api)
  - [x] Bundle -> (webpack builds correctly)
  - [x] DB ()
    - [x] Connector -> (Prisma set up to handle DB schema/migrations)
    - [x] Docker -> (Docker compose correctly spins up a DB)
  - [ ] Docs Endpoints / GraphQL -> (Documentation is created for Endpoints)
  - [ ] Test -> (test environemnt is set up/working)
  
- App
  - [x] Bundle -> (webpack builds correctly)
  - [ ] Docs Components -> (documentation for all components is compiled/served)
  - [ ] Test -> (test environemnt is set up/working)