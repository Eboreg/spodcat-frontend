## Useful links

- https://icones.js.org/collection/mdi
- https://lucide.dev/icons/

## Redeploy

```shell
$ pnpm sync
$ pnpm build
$ pm2 restart Spodcat
```

## Restart PM2

```shell
$ pm2 kill
$ pm2 start ecosystem.config.cjs
```
