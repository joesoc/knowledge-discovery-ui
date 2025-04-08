module.exports = {
  "/api/answerserver": {
    target: "https://answerserver.idoldemos.net:12000",
    secure: false,
    pathRewrite: { "^/api/answerserver": "" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/api/qms": {
    target: "https://qms.idoldemos.net:16000",
    secure: false,
    pathRewrite: { "^/api/qms": "" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/vector/api/nifi/audit/search": {
    target: "https://webui.idoldemos.net",
    secure: false,
    pathRewrite: { "^/vector/api/nifi/audit/search": "/api/nifi/audit/search" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/api/view": {
    target: "https://view.idoldemos.net:9080",
    secure: false,
    pathRewrite: { "^/api/view": "" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/api/dah": {
    target: "https://dah.idoldemos.net:9060",
    secure: false,
    pathRewrite: { "^/api/dah": "" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/api/mlmodels": {
    target: "https://mlmodels.idoldemos.net:5000",
    secure: false,
    pathRewrite: { "^/api/mlmodels": "" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/api/answerbank/feedback": {
    target: "https://webui.idoldemos.net/nifi/feedback",
    secure: false,
    pathRewrite: { "^/api/answerbank/feedback": "" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/api/agents/completions": {
    target: "https://webui.idoldemos.net/mistral",
    secure: false,
    pathRewrite: { "^/api/agents": "/agents" },
    changeOrigin: true,
    logLevel: "debug",

    // Optional: Add debugging only to this route
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[ProxyReq] ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[ProxyRes] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
    }
  },
  "/api/answerbank": {
    target: "https://webui.idoldemos.net/api/peoplealsoasked",
    secure: false,
    pathRewrite: { "^/api/answerbank": "" },
    changeOrigin: true,
    logLevel: "debug"
  },
  "/api/community": {
    target: "https://community.idoldemos.net:9030",
    secure: false,
    pathRewrite: { "^/api/community": "" },
    changeOrigin: true,
    logLevel: "debug"
  }
};
