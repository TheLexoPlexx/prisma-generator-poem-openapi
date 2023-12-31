import { generatorHandler } from '@prisma/generator-helper';
import { DMMF, GeneratorOptions } from '@prisma/generator-helper';
import { parseEnvValue } from '@prisma/internals';
import { promises } from 'fs';
import { join } from 'path';

const { mkdir, writeFile } = promises;

generatorHandler({
  onManifest: () => ({
    defaultOutput: './poem',
    prettyName: 'Rust Poem OpenAPI',
  }),
  onGenerate: generate,
});


const default_filename = "prisma_openapi.rs"
const api_name = "Api"

const autoGeneratedComment = `// ------------------------------------------------------
// Generated with github.com/thelexoplexx/prisma-generator-poem-openapi
// Do not edit manually, it will be overwritten with the next "prisma generate"
// It is not formated nicely because it is not meant to be read or seen anways.
// ------------------------------------------------------`

const imports = `use chrono::NaiveDateTime;
use poem::{web::Data, Result, error::InternalServerError};
use poem_openapi::{param::Path, payload::Json, Object, OpenApi};
use sqlx::PgPool;`

const spaces = "    "

async function generate(options: GeneratorOptions) {
  const { output, config } = options.generator;
  const out_dir = parseEnvValue(output!);
  const file_name = config.outputName || default_filename;

  try {
    await mkdir(out_dir, { recursive: true });

    // for debugging dmmf schema
    // await writeFile('./test.json', JSON.stringify(options.dmmf.datamodel));

    const out_rust = generate_poem_openapi(
      options.dmmf
    )

    await writeFile(join(out_dir, file_name), out_rust);
  } catch (e) {
    console.error('Error: unable to write files for Prisma DBML Generator');
    throw e;
  }
}

function findType(type: String): String {
  switch (type) {
    case "Int":
      return "i32"
    case "DateTime":
      return "NaiveDateTime"
    default:
      return type
  }
}

function oai(path: string, method: string) {
  return `#[oai(path = \"/${path}\", method = \"${method}\")]`
}

function generate_poem_openapi(
  dmmf: DMMF.Document,
): string {

  let structs: String[] = [];

  dmmf.datamodel.models.forEach(model => {
    structs.push("#[derive(Object)]")
    structs.push(`pub struct ${model.name} {`)

    let filtered_fields = model.fields.filter(field => {
      return dmmf.datamodel.models.filter(m => m.name == field.type).length == 0
    })

    filtered_fields.forEach(field => {
      let type = findType(field.type)

      if (field.isList) {
        type = "Option<Vec<" + type + ">>"
      }

      if (!field.isRequired) {
        type = "Option<" + type + ">"
      }

      structs.push(spaces + (field.dbName || field.name) + ": " + type + ",")

    });
    structs.push(`}\n`)
  })

  let api: String[] = [];
  api.push("pub struct " + api_name + ";\n")
  api.push("#[OpenApi]")
  api.push("impl " + api_name + " {")
  dmmf.datamodel.models.forEach(model => {

    let dbname = model.dbName || model.name

    api.push(`
    ${oai(dbname.toLowerCase(), "get")}
    async fn get_${dbname.toLowerCase()}(&self, pool: Data<&PgPool>) -> Result<Json<Vec<${model.name}>>> {
      let get = sqlx::query_as!(${model.name}, \"SELECT * FROM \\\"${dbname}\\\"\").fetch_all(pool.0).await.expect(\"Failed to get ${dbname}\");
      Ok(Json(get))
    }`)

    let primary = model.fields.filter(field => field.isId)[0].name //TODO: More than one identifier possible?

    api.push(`
    ${oai(dbname.toLowerCase() + "/:" + primary, "get")}
    async fn get_${dbname.toLowerCase()}_by_id(&self, ${primary}: Path<String>, pool: Data<&PgPool>) -> Result<Json<Vec<${model.name}>>> {
      let get = sqlx::query_as!(${model.name}, \"SELECT * FROM \\\"${dbname}\\\" WHERE ${primary} = $1\", &${primary}.0).fetch_all(pool.0).await.expect(\"Failed to get by id ${dbname}\");
      Ok(Json(get))
    }`)

    api.push(`
    ${oai(dbname.toLowerCase() + "/:" + primary, "delete")}
    async fn delete_${dbname.toLowerCase()}_by_id(&self, ${primary}: Path<String>, pool: Data<&PgPool>) -> Result<Json<u64>> {
    let get = sqlx::query!(\"DELETE FROM \\\"${dbname}\\\" WHERE ${primary} = $1\", &${primary}.0).execute(pool.0).await.expect(\"Failed to delete ${dbname}\").rows_affected();
    Ok(Json(get))
    }`)

    let filtered_fields = model.fields.filter(field => {
      return dmmf.datamodel.models.filter(m => m.name == field.type).length == 0
    })

    const fields = filtered_fields.map(f => f.name).join(", ")
    const field_numbers = filtered_fields.map((f, i) => "$" + (i + 1)).join(", ")
    let binds: String[] = []
    filtered_fields.forEach(field => {
      binds.push(".bind(&input." + (field.dbName || field.name) + ")")
    })

    api.push(`
    ${oai(dbname.toLowerCase(), "post")}
    async fn post_${dbname.toLowerCase()}(
        &self,
        pool: Data<&PgPool>,
        input: Json<${model.name}>,
    ) -> Result<Json<String>> {
      match sqlx::query("INSERT INTO \\\"${dbname}\\\" (${fields}) values (${field_numbers})")${binds.join("")}.execute(pool.0).await {
      Ok(x) => {
          println!("Inserted ${dbname}");
          dbg!(x);
          Ok(Json("ok".to_string()))
        }
        Err(e) => {
          println!("Failed to insert ${dbname}: {}", e);
          Err(InternalServerError(e))
        }
      }
    }`)

  })
  api.push("}\n")

  return [
    autoGeneratedComment,
    imports,
    structs.join("\n"),
    api.join("\n")
  ].join('\n\n');
}