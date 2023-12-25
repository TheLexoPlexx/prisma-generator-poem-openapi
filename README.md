# Prisma Generator for Poem OpenAPI

[[Poem OpenAPI](https://crates.io/crates/poem-openapi)] - [[Prisma](https://www.prisma.io/)]

# --- WORK IN PROGRESS ---

### If you somehow stumpled upon this, feel free to open a PR and contribute.

## What this is supposed to do:
Create all useful API-Requests out of the box based on a Prisma-Schema, CRUD, Read-by-Id and maybe some others
- It currently skips all relations and custom Models, which means it is an accurate representation of the database, except all sql-errors are passed back to the request.

**This is not meant to be a replacement for the [prisma-client-rust](https://github.com/Brendonovich/prisma-client-rust), but rather a tool to generate the API. For different use-cases.**

## Why?
Why not? You can find an example of me using it [in my cereal repo](https://github.com/thelexoplexx/cereal).

## How to use:
1. ~~Install the generator: `npm i prisma-generator-poem-openapi`~~ //TODO?
2. Add the generator to your `schema.prisma`:
```prisma
generator poem-openapi {
  provider = "poem-openapi"
  output   = "./generated/openapi"
}
```
3. Run `prisma generate` to generate the API-Requests

## Roadmap (in no particular order):
- [x] Create
  - [ ] Better Error Handling
- [x] Read all
- [x] Read by Id
- [ ] Update
- [ ] Update single value
- [x] Delete single value
  - [ ] Better Error Handling
- [ ] Additional options to opt out of certain actions and not generate those
- [ ] Automatically log all granular changes or allow an option to do so (ideas welcome)
- [x] Option: custom path for the generated files
- [x] Option: custom name for the generated file
- [ ] Automatic Testing
- [ ] Option: Change API name
- [ ] Rust-Macros for smaller code

## License
For now: CC-BY-NC-SA 4.0, might change in the future, idk.