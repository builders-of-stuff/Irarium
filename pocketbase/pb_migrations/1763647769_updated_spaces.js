/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1874629670",
    "max": 0,
    "min": 0,
    "name": "tags",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2363381545",
    "max": 0,
    "min": 0,
    "name": "type",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3545646658",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "createdBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation1662972666",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "mods",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // remove field
  collection.fields.removeById("text1874629670")

  // remove field
  collection.fields.removeById("text2363381545")

  // remove field
  collection.fields.removeById("relation3545646658")

  // remove field
  collection.fields.removeById("relation1662972666")

  return app.save(collection)
})
