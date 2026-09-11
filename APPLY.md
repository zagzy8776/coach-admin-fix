# Apply the admin fix to truthoutu/coach

Copy every `src/` file in this repo into the same path in https://github.com/truthoutu/coach then commit and push.

## After deploy

1. In Vercel add env var `ADMIN_PASSWORD` and redeploy.
2. Open `/admin` and sign in.
3. Products now have Style number / SKU and Number of bags in stock, plus Edit.
4. Orders can change status. Confirming an order subtracts bag stock.
