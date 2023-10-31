# Prisma Generator for Poem OpenAPI

# --- WORK IN PROGRESS ---

### If you somehow stumpled upon this, feel free to open a PR and contribute.

## What this is supposed to do:
Create all useful API-Requests out of the box based on a Prisma-Schema, CRUD, Read-by-Id and maybe some others

**This is not meant to be a replacement for the [prisma-client-rust](https://github.com/Brendonovich/prisma-client-rust), but rather a tool to generate the API.**

## Why?
Why not? You can find an example of me using it [in my cereal repo](https://github.com/thelexoplexx/cereal).

## How to use:
1. ~~Install the generator: `npm i -g prisma-generator-poem-openapi`~~ //TODO
2. Add the generator to your `schema.prisma`:
```prisma
generator poem-openapi {
  provider = "poem-openapi"
  output   = "./generated/openapi"
}
```
3. Run `prisma generate` to generate the API-Requests

## TODO:
- [ ] Create
- [x] Read all
- [ ] Read by Id
- [ ] Update
- [ ] Update single value
- [ ] Delete
- [ ] Automatically log all granular changes or allow an option to do so (ideas welcome)
- [x] Option: custom path for the generated files
- [x] Option: custom name for the generated file

## License
For now: CC-BY-NC-SA 4.0