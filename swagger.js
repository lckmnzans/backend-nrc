import swaggerJsdoc from 'swagger-jsdoc'
    import swaggerUi from 'swagger-ui-express'
    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'NRC Archiving',
          description: "API endpoints for a web app documents archiving",
          contact: {
            name: "Lukman Sanusi",
            email: "lckmnzans@gmail.com",
            url: "https://github.com/lckmnzans/backend-nrc"
          },
          version: '1.0.0',
        },
        servers: [
          {
            url: `http://localhost:${require('./config/keys').port}/`,
            description: "Local server"
          },
          {
            url: "<your live url here>",
            description: "Live server"
          },
        ]
      },
      // looks for configuration in specified directories
      apis: ['./router/*.js'],
    }
    const swaggerSpec = swaggerJsdoc(options)
    function swaggerDocs(app, port) {
      // Swagger Page
      app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
      // Documentation in JSON format
      app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
      })
    }
    export default swaggerDocs