/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number4156564586",
    "max": null,
    "min": null,
    "name": "size",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // remove field
  collection.fields.removeById("number4156564586")

  return app.save(collection)
})
