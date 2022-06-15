# Twenty Four

Experience objects for learning colors, numbers, and geometry (vite, ts, d3, paper)

<img width="2048" alt="Screen Shot 2022-06-14 at 5 39 36 PM" src="https://user-images.githubusercontent.com/409114/173712345-2c0f4ef0-b47a-47d5-bc73-9901b75d3ef2.png">

<img width="2048" alt="Screen Shot 2022-06-14 at 5 39 32 PM" src="https://user-images.githubusercontent.com/409114/173712358-4133b54c-ea7b-43ad-812a-6ea811b51c1e.png">

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
