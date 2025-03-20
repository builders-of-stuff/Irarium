/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // update collection data
  unmarshal({
    "createRule": "@request.body.isFullyUpgraded = false"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1743682018")

  // update collection data
  unmarshal({
    "createRule": null
  }, collection)

  return app.save(collection)
})
