# Twenty Four

Experience objects for learning colors, numbers, and geometry (vite, ts, d3, paper)

### Older

<img width="2048" alt="Screen Shot 2022-07-23 at 10 43 09 AM" src="https://user-images.githubusercontent.com/409114/180616835-6c9ba7ef-4d6d-43fd-89bd-5797fc20c137.png">

<img width="2048" alt="Screen Shot 2022-07-23 at 10 43 00 AM" src="https://user-images.githubusercontent.com/409114/180616837-7915765a-0d58-4d94-9ec7-b1f73f4d0efb.png">

### Younger

<img width="2048" alt="Screen Shot 2022-07-23 at 10 43 23 AM" src="https://user-images.githubusercontent.com/409114/180616841-31e8ee76-a339-463d-a730-2aaa20343a54.png">

<img width="2048" alt="Screen Shot 2022-07-23 at 10 43 16 AM" src="https://user-images.githubusercontent.com/409114/180616844-708fc532-6b67-4460-a5a3-34552e26976e.png">

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
