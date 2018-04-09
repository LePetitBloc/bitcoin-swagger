# bitcoin-swagger
**Bitcoin** Rest API swagger specification document in Yml and Json (OpenAPI).

> The current version uses the Version 2.0 of the OpenAPI Specification:
> https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md

## Usage
You can import the YML/Json file in the [Swagger editor](http://editor.swagger.io/) and generate a client for any [supported languages](https://swagger.io/open-source-integrations/).

## Resources
* Version 2.0 of the OpenAPI Specification https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
* https://github.com/bitcoin/bitcoin/blob/master/doc/REST-interface.md

## Common pitfalls
Bitcoin Rest API doesn't provide any mechanism to handle CORS. For the time being we recommend to setup an Nginx proxy in front of the **Bitcoin** Rest API.

> see the following PR on Bitcoin repository:
> [add support for CORS headers](https://github.com/bitcoin/bitcoin/pull/12040)

## Development
> We're using a local [swagger-editor](https://github.com/swagger-api/swagger-editor) and a `bitcoind` binary running on the `testnet` to develop and live-test the specification file.
> You can start them both as containers with docker-composer.

1. Start `bitcoind` and `swagger-editor` containers via `docker-compose`:
```
docker-compose up
```
2. Visit http://localhost:3000
3. Import `swagger.yml` from the *> File > Import file* menu in the GUI.

> **Note:** The YML file is used as the reference, the Json file is exported via the GUI.

## Licence
MIT