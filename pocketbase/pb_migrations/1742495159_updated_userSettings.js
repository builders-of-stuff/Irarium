/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = userId.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // update collection data
  unmarshal({
    "listRule": null
  }, collection)

  return app.save(collection)
})
