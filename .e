SERVER_URL_PREFIX=""
#SERVER_HOSTNAME="0.0.0.0"
SERVER_JWT_EXPIRATION="1w"

APP_PATH="app"


# Database
DB_USER="app"
DB_PASS="HOLYCHICKEN"


POSTGRES_USER=$DB_USER
POSTGRES_PASSWORD=$DB_PASS



DATABASE_URL="postgres://${DB_USER}:${DB_PASS}@localhost:7377"