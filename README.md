# spodcat

This is the frontend part of my podcast platform, designed to go along with [the backend part](https://github.com/Eboreg/spodcat-backend). It's built on Ember, because I was stupid and chose to learn that instead of an actually useful and non-dying frontend framework.

As it stands, it's pretty tailor-made for my needs and tastes. The deployment script will not work for you, and you will probably not like the design. But everything can be tweaked with a bit of patience!

A live instance can be viewed [here](https://podd.huseli.us).

## Configuration

### Build environment

Some values need to be put in a `.env` file in the project root. Here are mine, as an example:

```
BACKEND_HOST_DEV=http://localhost:8000
BACKEND_HOST_PROD=https://backend.podd.huseli.us
FASTBOOT_HOST_WHITELIST=podd.huseli.us,testpodd.huseli.us
FRONTEND_HOST_DEV=http://localhost:4200
FRONTEND_HOST_PROD=https://podd.huseli.us
SITE_NAME=podd.huseli.us
```
`SITE_NAME` is only used for setting `<meta property="og:site_name">` in the HTML head. The rest should be self-explanatory.
