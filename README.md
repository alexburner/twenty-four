# Twenty Four

Experience objects for learning colors, numbers, and geometry (vite, ts, d3, paper)

<img width="2048" alt="Screen Shot 2022-06-14 at 11 32 24 PM" src="https://user-images.githubusercontent.com/409114/173758351-b29a1e05-34ee-428c-b237-80f4fe1c35aa.png">

<img width="2048" alt="Screen Shot 2022-06-14 at 11 32 16 PM" src="https://user-images.githubusercontent.com/409114/173758367-899d4ce4-f26d-4235-bf17-c3af054aa52d.png">


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
