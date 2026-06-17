import "@/assets/scss/base.scss";
import "material-symbols/outlined.css";

import { createI18n } from "vue-i18n";
import { createApp } from "vue";
import { createHead } from "@unhead/vue/client";
import App from "@/App.vue";
import router from "@/router";
import { createPinia } from "pinia";
import { PiniaColada } from "@pinia/colada";
import { DataLoaderPlugin } from "vue-router/experimental";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAndroid,
  faApple,
  faDiscord,
  faFacebook,
  faItunes,
  faPatreon,
  faSpotify,
  faSquareXTwitter,
  faTelegram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { messages } from "./i18n";

declare module "vue-router" {
  export interface TypesConfig {
    Router: typeof router;
  }
}

const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages,
});
const app = createApp(App);
const head = createHead();

library.add(
  faAndroid,
  faApple,
  faDiscord,
  faFacebook,
  faItunes,
  faPatreon,
  faSpotify,
  faSquareXTwitter,
  faTelegram,
  faWhatsapp,
);
app.use(head);
app.use(i18n);
app.use(DataLoaderPlugin, { router });
app.use(router);
app.use(createPinia());
app.use(PiniaColada);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
