<div style="text-align:center">

# AppStack

This Template should compile into a server.js NodeJS app that serves the ReactJS WebApp static files as well as functioning as the API of the application.

Bundling a Full-Stack Application that includes API/WebApp/DB along with unit/integration tests, and their respective documentation. 

Point is a developer only needs to execute `yarn docker:compose` to have Server/DB ready to answer on local machine.

My goal is to create the simplest template imaginable while also utilizing powerful and carefully picked concepts/libraries.

I imagine the test of time will let me know what works and what doesn't but I plan to do the most research and only include the reasonable bits.

</div>

---

### TODO LIST

- Main
- [ ] Main Page (Short intro into the App's purpose)
  - [ ] Docs Main -> (Api/UI docs for developers)
- [ ] Docker
  - [ ] Image Server    -> (App is packaged into an image)
  - [ ] Image DB        -> (DB is packaged into an image)
  - [ ] Compose Develop -> (App is spun up, along with DB with Docker Compose)

- Server (Api)
  - [x] Bundle -> (webpack builds correctly)
  - [x] DB
    - [x] Prisma -> (Prisma set up to handle DB schema/migrations)
    - [x] Docker -> (Docker compose correctly spins up a DB)
  - [ ] Docs Endpoints / GraphQL -> (Documentation is created for Endpoints)
  - [ ] Test -> (test environemnt is set up/working)
  
- App
  - [x] Bundle -> (webpack builds correctly)
  - [ ] Docs Components -> (documentation for all components is compiled/served)
  - [ ] Test -> (test environemnt is set up/working)