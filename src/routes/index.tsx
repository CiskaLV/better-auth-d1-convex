import { createFileRoute } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { authClient } from "~/lib/auth/client";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const session = authClient.useSession();

  return (
    <div class="h-screen justify-center flex flex-col items-center">
      <h1>Welcome to Tanstack Start + Better Auth + Cloudflare D1!</h1>
      <Show
        when={session().data}
        fallback={
          <button
            onClick={() => authClient.signIn.social({ provider: "github" })}
          >
            Login With GitHub
          </button>
        }
      >
        <pre>{JSON.stringify(session().data, null, 2)}</pre>
        <button onClick={() => authClient.signOut()}>SignOut</button>
      </Show>
    </div>
  );
}
