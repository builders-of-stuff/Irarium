/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2282016245",
    "max": null,
    "min": null,
    "name": "spaceLimit",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // remove field
  collection.fields.removeById("number2282016245")

  return app.save(collection)
})
