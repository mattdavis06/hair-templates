import { initBotId } from "botid/client/core"

// Server Actions post to the page they're rendered on, and any page can hold a form.
initBotId({
  protect: [{ path: "/*", method: "POST" }],
})
