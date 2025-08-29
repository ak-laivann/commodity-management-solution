# React + TypeScript + Vite

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

---

# 🛒 Store Management App

A role-based Vite application with authentication, theming, and user management.

## 🚀 Features

- **Authentication**

  - Login with **Google** or **Facebook** (social logins).
  - Login with **password** (default password: `1000`).
  - No user data is stored persistently.

- **Dark Mode**

  - Toggle dark mode with **`Alt + Shift + D`**.

- **User Roles**

  - On first login, users are created and added to a dropdown list.
  - Default role: **Manager**.
  - Users can switch roles between:
    - **Manager** → Full access, including **Dashboard**.
    - **Storekeeper** → No access to Dashboard.
  - Role change immediately updates the UI.

- **Product Management**

  - All users (Managers & Storekeepers) can:
    - Add products
    - Edit products
    - View products
    - Access product listing page

- **Manager Switching**

  - Click the **profile icon** (top right).
  - Select **Change Set of Users**.
  - Pick any user from the dropdown to switch manager context.

- You can download the listing page as excel as well.

## Dependencies used

- [x] [AntDesign](https://ant.design/) - for UI and icons
- [x] [Faker-js](https://fakerjs.dev/) - for creating random data and simulate ai responses.
- [x] [React](https://react.dev/) - come-on! I would have died before finishing this project if it wasn't for him. (_That's why he is the GOAT! the GOAT!!!_)
- [x] [React-router-dom](https://reactrouter.com/) - for navigation and combining layouts through routes (SPA!).
- [x] [React-toastify](https://www.npmjs.com/package/react-toastify) - for toast and they have custom controls too!
- [x] [Typescript](https://www.typescriptlang.org/) - The protector. (_It was perfect! PERFECT!. Down to the last minute detail_)
- [x] [ShadCn](https://ui.shadcn.com/) - Ready made UIs with charts.
- [x] [Tansack](https://tanstack.com/) - Easy to implement Async handlings.
- [x] [Mirage](https://miragejs.com/) - The name should tell you - MIRAGE (backend mock)/

# Live Link

- [x] [Commodity Management Solution](https://commodity-management-solution.vercel.app/products/all) - Deployed in [Vercel](https://vercel.com/)
