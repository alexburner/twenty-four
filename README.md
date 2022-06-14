# Twenty Four

Experience objects for learning colors, numbers, and geometry (vite, ts, d3, paper)
<img width="2048" alt="Screen Shot 2022-06-14 at 4 08 17 PM" src="https://user-images.githubusercontent.com/409114/173703895-8f45c1d4-544c-44b6-a285-e622dbfd55fe.png">
<img width="2048" alt="Screen Shot 2022-06-14 at 4 08 13 PM" src="https://user-images.githubusercontent.com/409114/173703914-794e01f3-3a73-418f-8650-516006380d1e.png">

## Scripts

```sh
npm run dev    # start dev server
npm run build  # build for production
npm run serve  # locally preview production build

npm run fix       # run all of the below:
npm run prettier  # run prettier --write
npm run eslint    # run eslint --fix
npm run tsc       # run tsc --no-emit
```

## Project init

- Use latest stable node (`nvm install 16`)
- Init with [`create-vite`](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) (`npm init vite@latest . -- --template vanilla-ts .`)
- Tighten `package.json`
  - Add `engines`
  - Use exact versions
- Improve DX
  - Increase `tsconfig.json` strictness
  - Add `prettier` & `eslint`
  - Add [`vite-plugin-checker`](https://github.com/fi3ework/vite-plugin-checker) (for `tsc` & `eslint` in dev/build)
  - Add `package.json` scripts
