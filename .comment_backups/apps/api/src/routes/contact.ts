import { Router } from 'express'
import { submitContact } from '../controllers/contactController'

const router: Router = Router()

router.post('/', submitContact)

export default router
