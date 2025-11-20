/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3704534508")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3929545014",
    "hidden": false,
    "id": "relation3816244959",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "spaceId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "json1177347317",
    "maxSize": 0,
    "name": "position",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3704534508")

  // remove field
  collection.fields.removeById("relation3816244959")

  // remove field
  collection.fields.removeById("json1177347317")

  return app.save(collection)
})
