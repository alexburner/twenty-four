# Twenty Four

Experience objects for learning colors, numbers, and geometry (vite, ts, d3, paper)

<img width="2048" alt="Screen Shot 2022-06-28 at 10 03 47 PM" src="https://user-images.githubusercontent.com/409114/176356121-07c19c24-7ede-40cf-be69-45bce1561e41.png">

<img width="2048" alt="Screen Shot 2022-06-28 at 10 03 55 PM" src="https://user-images.githubusercontent.com/409114/176356111-b4818667-561e-4b28-95f3-0ee5f9ab44c4.png">

<img width="2048" alt="Screen Shot 2022-07-02 at 9 44 50 AM" src="https://user-images.githubusercontent.com/409114/177009181-0d0c99cc-5ddc-4fd5-bbd7-89b6413a126b.png">

<img width="2048" alt="Screen Shot 2022-07-02 at 9 44 42 AM" src="https://user-images.githubusercontent.com/409114/177009184-e878c82e-9bdb-4652-89fe-8f119a1dfb34.png">


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
