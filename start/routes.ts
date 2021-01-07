import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// A typical route handler
Route.get('/', async ({ view }: HttpContextContract) => {
  return view.render('index')
}).as('index')

/* A catch-all route handler. If a user hits the address http://example.com/a-route-that-does-not-exist directly in the browser, then our Vue.js app will mount, and routing will be delegated to vue-router.
 */
Route.get('*', async ({ view }: HttpContextContract) => {
  return view.render('index')
}).as('not_found')
