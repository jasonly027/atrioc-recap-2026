import { createShadowRootUi, defineContentScript } from "#imports";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "~/assets/app.css";

export default defineContentScript({
  matches: ["*://*.youtube.com/watch*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "atrioc-recap-tracker",
      anchor: "#secondary-inner",
      position: "inline",
      append: "first",

      onMount(container) {
        const wrapper = document.createElement("div");
        container.append(wrapper);

        const root = ReactDOM.createRoot(wrapper);
        root.render(<App />);

        return { wrapper, root };
      },
      onRemove(elements) {
        elements?.wrapper.remove();
        elements?.root.unmount();
      },
    });

    ui.autoMount();
  },
});
