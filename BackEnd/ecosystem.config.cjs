module.exports = {
  apps: [
    {
      name: "Backend",
      script: "./index.js",
      node_args: "--env-file ./.env",
      env: {
        JWT_SECRET: "mySecretKey",
        JWT_EXPIRATION: "60m",
        PAYPAL_CLIENT_ID:
          "ARyXhClwj0pUinvggRLl-za1xZITPxBZ4rhWk24bYKCQ744ZHE6HyGUuuAJPPNuFRtmpuXXepZMVtiu2",
        PAYPAL_SECRET:
          "EMrJRqMSrcT5omRx_Db2-2OGIekcRUtsB_fi6bkH3sgoybzQTMWiK0X7YS6uBG2AdvlLPXiyg4s_iHFE",
        PAYPAL_BASE_URL: "https://api-m.sandbox.paypal.com",
        BASE_URL: "http://localhost:3005",
        EMAIL_APP_PASSWORD: "unom_owtx_nfvr_faqj",
        MPESA_PUBLIC_KEY:'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmptSWqV7cGUUJJhUBxsMLonux24u+FoTlrb+4Kgc6092JIszmI1QUoMohaDDXSVueXx6IXwYGsjjWY32HGXj1iQhkALXfObJ4DqXn5h6E8y5/xQYNAyd5bpN5Z8r892B6toGzZQVB7qtebH4apDjmvTi5FGZVjVYxalyyQkj4uQbbRQjgCkubSi45Xl4CGtLqZztsKssWz3mcKncgTnq3DHGYYEYiKq0xIj100LGbnvNz20Sgqmw/cH+Bua4GJsWYLEqf/h/yiMgiBbxFxsnwZl0im5vXDlwKPw+QnO2fscDhxZFAwV06bgG0oEoWm9FnjMsfvwm0rUNYFlZ+TOtCEhmhtFp+Tsx9jPCuOd5h2emGdSKD8A6jtwhNa7oQ8RtLEEqwAn44orENa1ibOkxMiiiFpmmJkwgZPOG/zMCjXIrrhDWTDUOZaPx/lEQoInJoE2i43VN/HTGCCw8dKQAwg0jsEXau5ixD0GUothqvuX3B9taoeoFAIvUPEq35YulprMM7ThdKodSHvhnwKG82dCsodRwY428kg2xM/UjiTENog4B6zzZfPhMxFlOSFX4MnrqkAS+8Jamhy1GgoHkEMrsT5+/ofjCx0HjKbT5NuA2V/lmzgJLl3jIERadLzuTYnKGWxVJcGLkWXlEPYLbiaKzbJb2sYxt+Kt5OxQqC1MCAwEAAQ==',
        MPESA_API_HOST: "api.sandbox.vm.co.mz",
        MPESA_API_KEY: "lr9hr0v9pnfyci3t4zscahc5y9e30p4b",
        MPESA_ORIGIN: "developer.mpesa.vm.co.mz",
        MPESA_SERVICE_PROVIDER_CODE: 171717,
    },
    },
  ],
};
