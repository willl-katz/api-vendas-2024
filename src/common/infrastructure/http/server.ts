import 'reflect-metadata'
import '@/common/infrastructure/container'

import { env } from '../env'
import { dataSource } from '../typeorm'
import { app } from './app'

dataSource
  .initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}! 🏆`)
      console.log('API docs available at GET /docs 📚')
    })
  })
  .catch(err => {
    console.error('Error initializing data source: ', err)
  })
