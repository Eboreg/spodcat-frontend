import { library, config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faFacebook, faPatreon, faDiscord } from "@fortawesome/free-brands-svg-icons";

config.autoAddCss = false;
library.add(faFacebook, faPatreon, faDiscord);
