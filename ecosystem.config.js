module.exports = {
  apps: [
    {
      name: "auth",
      cwd: "./auth",
      script: "server.js",
      watch: true,
      env_file: ".env"
    },
    {
      name: "order",
      cwd: "./order",
      script: "server.js",
      watch: true,
      env_file: ".env"
    },
    {
      name: "payment",
      cwd: "./payment",
      script: "server.js",
      watch: true,
      env_file: ".env"
    },
    {
      name: "product",
      cwd: "./product",
      script: "server.js",
      watch: true,
      env_file: ".env"
    },
    {
      name: "cart",
      cwd: "./cart",
      script: "server.js",
      watch: true,
      env_file: ".env"
    },
    {
      name: "ai",
      cwd: "./ai",
      script: "server.js",
      watch: true,
      env_file: ".env"
    },
    {
      name: "notification",
      cwd: "./notification",
      script: "server.js",
      watch: true,
      env_file: ".env"
    },
    {
      name: "dashboard",
      cwd: "./dashboard",
      script: "server.js",
      watch: true,
      env_file: ".env"
    }
  ]
};
