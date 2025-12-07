/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "json1863427777",
    "maxSize": 0,
    "name": "subscribedSpaces",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // remove field
  collection.fields.removeById("json1863427777")

  return app.save(collection)
})
