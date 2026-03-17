## Vue Admin 脚手架

技术栈：Vue 3 + Vite + Element Plus + Vue Router + Pinia + Axios

### 开发启动

```bash
cd vue-admin
npm install
npm run dev
```

### 登录说明

- `admin`：拥有「用户管理」权限
- `demo`：无该权限（会被路由守卫拦截并提示）

> 该脚手架为演示用途，用户管理 CRUD 使用 `localStorage` 模拟数据源；实际项目中可把 `src/api/users.ts` 替换为真实后端接口（配合 `src/api/http.ts`）。

