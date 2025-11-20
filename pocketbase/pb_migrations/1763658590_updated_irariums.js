/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3704534508")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  // remove field
  collection.fields.removeById("json1177347317")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3704534508")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_YC6iIwuwwu` ON `irariums` (`position`)"
    ]
  }, collection)

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
})
