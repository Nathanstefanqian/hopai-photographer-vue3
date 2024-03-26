interface ErrorCode {
  '401': string;
  '403': string;
  '404': string;
  default: string;
}

export const errorCode: ErrorCode = {
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  default: 'Unknown Error'
};
