/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "bool3538222689",
    "name": "isShared",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // remove field
  collection.fields.removeById("bool3538222689")

  return app.save(collection)
})
