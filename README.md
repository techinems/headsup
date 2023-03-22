[![deploy headsup](https://github.com/techinems/headsup/actions/workflows/main.yml/badge.svg)](https://github.com/techinems/headsup/actions/workflows/main.yml)

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)


# Heads up

**Heads up** is RPIA's digital whiteboard, displaying crew info, chores, notes, and providing dispatch notifcations.



### Setup
Setup of **Heads up** involves a few steps, but isn't very difficult. You'll need to load our code onto your server, set up **ChoreBot** and **Herald** integrations, and set some enviornment variables.

#### Website
**Heads up** retrieves crew data from the RPIA Website Database `ambulanc_web`. Simply populate your enviornment variables with the appropriate `DB_HOST`, `DB_USER`, and `DB_PASSWORD`.

#### ChoreBot
Chorebot integration requires no additional configuration of **Heads up**. Simply provide the url of your **Headsup** service to **ChoreBot**, and let **Chorebot** handle the rest.

#### Herald
Dispatch Notifcations are provided by **Herald**. To enable dispatch notifcations:
1. Generate a secret token. This will be used by **Herald** to authenticate dispatch notifications.
1. Appropriately configure **Herald**'s enviornment variables with the secret token.
1. Set `HERALD_TOKEN` to your secret token in your **Heads up** enviornment.

#### Your Server
You can easily deploy this app using the Docker Compose and the provided `docker-compose.yml` file by running `docker-compose up`.



## Credits

### Developers
- [Dan Bruce](https://github.com/ddbruce)
- [Logan Ramos](https:://github.com/lramos15)

### License
**Heads up** is provided under the [MIT License](https://opensource.org/licenses/MIT).

### Contact
For any question, comments, or concerns, email [dev@rpiambulance.com](mailto:dev@rpiambulance.com), [create an issue](https://github.com/techinems/headsup/issues/new), or open up a pull request.
