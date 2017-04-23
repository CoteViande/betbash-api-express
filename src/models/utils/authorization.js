import { UnauthorizedError } from '../../utils/errors'

const isLoggedIn = signature => (
  process.env.NODE_ENV === 'development' ||
  (signature && signature.id)
)

const isSelf = (signature, userId) => (
  process.env.NODE_ENV === 'development' ||
  (isLoggedIn(signature) && signature.id === userId)
)

const hasRole = (signature, role) => (
  process.env.NODE_ENV === 'development' || (
    isLoggedIn(signature) && (
      signature.scopes.includes(role) || signature.scopes.includes('admin')
    )
  )
)

const isAdmin = signature => hasRole(signature, 'admin')

const isAdminOrSelf = (signature, user) => (isAdmin(signature) || isSelf(signature, user))

export const requireLogin = signature => {
  if (!isLoggedIn(signature)) throw new UnauthorizedError()
}

export const requireAdminOrSelf = (signature, user) => {
  if (!isAdminOrSelf(signature, user)) throw new UnauthorizedError()
}
