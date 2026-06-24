export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("error", (error, context) => {
    //console.log("error hook", error.cause?.response, error.cause?.data);
  });
  /*
  nitroApp.hooks.hook("beforeResponse", (event, res) => {
    console.log("beforeResponse", res);
  });
  nitroApp.hooks.hook("afterResponse", (event, res) => {
    console.log("afterResponse", res);
  });
  nitroApp.hooks.hook("render:response", (res, context) => {
    console.log("render:esponse", res);
  });
  */
});
