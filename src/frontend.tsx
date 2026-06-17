/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { IS_FACEBOOK_INSTANT_GAMES } from "./shared/feature-flags";
import { fbInstantAuthService, userService, analyticsService, ANALYTICS_EVENTS } from "./shared/services";

async function bootstrap() {
  if (IS_FACEBOOK_INSTANT_GAMES) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/fbinstant.8.0.js";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
    await FBInstant.initializeAsync();
    await FBInstant.startGameAsync();

    const result = await fbInstantAuthService.signIn();
    if (result.user) {
      await userService.saveFBUserToFirestore(
        result.user.uid,
        fbInstantAuthService.getPlayerName(),
        fbInstantAuthService.getPlayerPhoto()
      );
      analyticsService.logEvent(ANALYTICS_EVENTS.SIGN_IN, { method: "facebook_instant" });
    }
  }

  const elem = document.getElementById("root")!;
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );

  if (import.meta.hot) {
    const root = (import.meta.hot.data.root ??= createRoot(elem));
    root.render(app);
  } else {
    createRoot(elem).render(app);
  }
}

bootstrap();
