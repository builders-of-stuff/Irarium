/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool3747656485",
    "name": "hasAnsible",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // remove field
  collection.fields.removeById("bool3747656485")

  return app.save(collection)
})
