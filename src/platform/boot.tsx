import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Loader } from "@/shared/ui";
import {
  fbSessionAuthService,
  userService,
  analyticsService,
  ANALYTICS_EVENTS,
} from "@/shared/services";
import { App } from "../app";
import { loadPlatform } from "./index";
import type { Platform } from "./types";

const queryClient = new QueryClient();

async function authenticatePlayer(platform: Platform): Promise<void> {
  if (process.env.BUN_PUBLIC_PLATFORM !== "fb") return;
  const player = platform.getPlayer();
  if (!player?.id || !player.signature) {
    console.warn("[boot] FB auth skipped, missing player", {
      id: player?.id,
      hasSignature: Boolean(player?.signature),
    });
    return;
  }
  const cred = await fbSessionAuthService.signIn(player.id, player.signature);
  await userService.saveFBUserToFirestore(cred.user.uid, player.name, player.photo);
  analyticsService.logEvent(ANALYTICS_EVENTS.SIGN_IN, { method: "facebook_instant" });
}

async function boot(): Promise<true> {
  const platform = await loadPlatform();
  await platform.initPlatform();
  await authenticatePlayer(platform);
  return true;
}

function Splash() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader />
    </div>
  );
}

function Gate() {
  const { data } = useQuery({
    queryKey: ["platform-boot"],
    queryFn: boot,
    staleTime: Infinity,
    retry: false,
  });
  return data ? <App /> : <Splash />;
}

export function Boot() {
  return (
    <QueryClientProvider client={queryClient}>
      <Gate />
    </QueryClientProvider>
  );
}
