module.exports = {
  apps: [
    {
      name: "auth",
      cwd: "./auth",
      script: "server.js",
      watch: true,
    },
    { 
      name: "order",
      cwd: "./order",
      script: "server.js",
      watch: true,
    },
    {
      name: "payment",
      cwd: "./payment",
      script: "server.js",
      watch: true,
    },
    {
      name: "product",
      cwd: "./product",
      script: "server.js",
      watch: true,
    },
    {
      name: "cart",
      cwd: "./cart",
      script: "server.js",
      watch: true,
    },
    {
      name: "ai",
      cwd: "./ai",
      script: "server.js",
      watch: true,
    },
    {
      name: "notification",
      cwd: "./notification",
      script: "server.js",
      watch: true,
    },
    {
      name: "dashboard",
      cwd: "./dashboard",
      script: "server.js",
      watch: true,
    }
  ]
};
