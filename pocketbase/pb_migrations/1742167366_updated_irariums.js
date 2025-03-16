/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3704534508")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = userId.id || isPublic = true",
    "viewRule": "@request.auth.id = userId.id || isPublic = true"
  }, collection)

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool4208731335",
    "name": "isPublic",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3704534508")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = userId.id || isPublished = true",
    "viewRule": "@request.auth.id = userId.id || isPublished = true"
  }, collection)

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool4208731335",
    "name": "isPublished",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
