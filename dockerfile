from node:alpine
#run pacman -Syu --noconfirm nodejs


copy ./dist /server
copy ./db/db.schema /server/schema.prisma

workdir /server
cmd node ./server.js