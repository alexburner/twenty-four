# Twenty Four

Experience objects for learning colors, numbers, and geometry (vite, ts, d3, paper)

<img width="2048" alt="Screen Shot 2022-06-12 at 3 39 14 PM" src="https://user-images.githubusercontent.com/409114/173256412-4b4c64fc-fa12-4df5-8339-f4b8b5cf9544.png">
<img width="2048" alt="Screen Shot 2022-06-12 at 3 39 09 PM" src="https://user-images.githubusercontent.com/409114/173256414-6f1bcce3-79df-4a11-87c6-390d27079d24.png">


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
