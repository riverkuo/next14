module.exports = {
    apps: [
      {
        name: 'test-next-app',
        script: 'server.js',                           
        env: {
          PORT: 3000,                            
          NODE_ENV: 'production'
        }
      },
    ]
  }