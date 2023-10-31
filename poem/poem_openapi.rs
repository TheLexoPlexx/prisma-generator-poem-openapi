// ------------------------------------------------------
// Generated with github.com/thelexoplexx/prisma-generator-poem-openapi
// Do not edit manually.
// ------------------------------------------------------`

use poem::{web::Data, Result};
use poem_openapi::{
    payload::{Json, PlainText},
    Object, OpenApi,
};
use sqlx::PgPool;

#[derive(Object)]
pub struct Plant {
    id: String
    label: String
    parts: Serialnumberpart
    order_number: Int
    order_list: Order
}

#[derive(Object)]
pub struct Serialnumberpart {
    serial: String
    part_id: String
    part: Part
    plant: Plant
    plant_id: String
    group: Serialnumberpart
    parent: Serialnumberpart
    parent_id: String
    manufacturing_date: Int
    shipping_date: Int
    installation_date: Int
}

#[derive(Object)]
pub struct Part {
    part_number: String
    serialnumberpart: Serialnumberpart
}

#[derive(Object)]
pub struct Project {
    id: String
    project_number: Int
    factory: Factory
    order_list: Order
}

#[derive(Object)]
pub struct Order {
    order_number: Int
    project: Project
    project_id: String
    plant_list: Plant
}

#[derive(Object)]
pub struct Final_Customer {
    id: String
    sap_id: String
    factory_list: Factory
    name: String
    alias: String
}

#[derive(Object)]
pub struct Prime_Contractor {
    id: String
    sap_id: String
}

#[derive(Object)]
pub struct Factory {
    id: String
    customer: Final_Customer
    customer_id: String
    name: String
    projects: Project
}


