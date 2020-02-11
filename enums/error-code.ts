export enum ErrorCode {
  InvalidAuthorization = 'invalid_authorization', // the supplied authorization token is invalid
  AuthenticationFailed = 'authentication_failed', // failed to authenticate with the credentials supplied
  InvalidArguments = 'invalid_arguments', // query arguments are invalid
  NotFound = 'not_found', // object not found
  AlreadyExists = 'already_exists', // can't create object because it already exists
  IntegrityError = 'integrity_error', // operation would cause an integrity error
  AccessDenied = 'access_denied', // current user is not allowed to perform this operation
  OperationFailed = 'operation_failed', // internal error, generic
  ConfigurationError = 'configuration_error', // internal error, service is not configured correctly
}
