import "./style.css";

import { formatPocMessage } from "./message";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Could not find #app.");
}

app.innerHTML = `
  <main class="shell">
    <p class="eyebrow">poc-projects / @poc/sample-web</p>
    <h1>${formatPocMessage("sample-web")}</h1>
    <p class="body">
      Yarn Berry는 루트가 담당하고, Vite+는 dev/check/test/build 흐름을 얇게 감싼
      샘플입니다.
    </p>
    <ul class="facts">
      <li>workspace: projects/sample-web</li>
      <li>package: @poc/sample-web</li>
      <li>dev server: vp dev --host 127.0.0.1 --port 3211</li>
    </ul>
  </main>
`;
