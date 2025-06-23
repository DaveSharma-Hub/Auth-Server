# Auth-Server

### Server uses RSASSA-PKCS1-v1_5 using SHA-512 hash algorithm with either a user defined key or a random 32 byte generated key for signing json web token

### Arguments SECRET_SIGNING_KEY MAX_AGE TOKEN_NAME ORIGIN in that order when starting server

Defaults to 32 bytes randome key, max age of 24 hours and jwt_access_token token name, and origin to only allow requests from a particular origin
