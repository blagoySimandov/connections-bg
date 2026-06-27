import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Loader } from "@/shared/ui";
import { GoogleLoginButton, FacebookLoginButton } from "./components";
import { IS_FACEBOOK_INSTANT_GAMES } from "@/shared";

export function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {IS_FACEBOOK_INSTANT_GAMES ? (
            <Loader />
          ) : (
            <>
              <GoogleLoginButton />
              <FacebookLoginButton />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
