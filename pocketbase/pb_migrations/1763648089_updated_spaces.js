/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && (@request.auth.id = createdBy.id || @request.auth.id ~ mods.id)",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.id = createdBy.id",
    "updateRule": "@request.auth.id != \"\" && \n(@request.auth.id = createdBy.id || mods.id ~ @request.auth.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3929545014")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": null,
    "updateRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
