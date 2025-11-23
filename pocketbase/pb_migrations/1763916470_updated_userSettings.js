/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number2086786895",
    "max": null,
    "min": null,
    "name": "spaceExpanders",
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
  collection.fields.removeById("number2086786895")

  return app.save(collection)
})
