from node:alpine
#run pacman -Syu --noconfirm nodejs


copy ./dist /server
copy ./db/db.schema /server

workdir /server
entrypoint node server.js