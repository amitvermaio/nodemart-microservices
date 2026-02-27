module.exports = {
  apps: [
    {
      name: "auth",
      cwd: "./auth",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/auth-error.log",
      out_file: "./logs/auth-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "order",
      cwd: "./order",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/order-error.log",
      out_file: "./logs/order-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "payment",
      cwd: "./payment",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/payment-error.log",
      out_file: "./logs/payment-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "product",
      cwd: "./product",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/product-error.log",
      out_file: "./logs/product-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "cart",
      cwd: "./cart",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/cart-error.log",
      out_file: "./logs/cart-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "ai",
      cwd: "./ai",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/ai-error.log",
      out_file: "./logs/ai-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "notification",
      cwd: "./notification",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/notification-error.log",
      out_file: "./logs/notification-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: "dashboard",
      cwd: "./dashboard",
      script: "server.js",
      watch: true,
      env_file: ".env",
      error_file: "./logs/dashboard-error.log",
      out_file: "./logs/dashboard-out.log",
      max_memory_restart: "500M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
