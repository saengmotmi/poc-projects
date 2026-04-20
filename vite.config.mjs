import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    enablePrePostScripts: true,
    cache: {
      scripts: false,
      tasks: true
    },
    tasks: {
      "build:all": {
        command: "vp run --filter '@poc/*' build"
      },
      "check:all": {
        command: "vp run --filter '@poc/*' check"
      },
      "test:all": {
        command: "vp run --filter '@poc/*' test"
      }
    }
  }
});
