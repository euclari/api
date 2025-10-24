export enum ErrorCode {
	// App
	InvalidContentType = 1001,
	InternalServerError,
	InvalidJSONBody,
	UnknownRoute,
	InvalidFileType,
	UnauthorizedContent,

	// Sessions - OTP
	InvalidCredentials = 2001,
	UnknownOTPCode,
	OTPCodeAlreadySent,
	PasswordMismatch,
	UnknownSession,
	ExpiredSession,
	SessionsLimitReached,
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
	[ErrorCode.InvalidContentType]:
		'Invalid content type, use "application/json"',
	[ErrorCode.InternalServerError]: 'Internal Server Error :D',
	[ErrorCode.InvalidJSONBody]: 'Invald JSON body',
	[ErrorCode.UnknownRoute]: 'Unknown route',
	[ErrorCode.InvalidFileType]: 'Invalid file type',
	[ErrorCode.UnauthorizedContent]: 'Unauthorized content',

	[ErrorCode.InvalidCredentials]: 'Invalid credentials',
	[ErrorCode.UnknownOTPCode]: 'Unknown OTP Code',
	[ErrorCode.OTPCodeAlreadySent]:
		'An OTP Code for this email has already been sent',
	[ErrorCode.PasswordMismatch]: 'Password mismatch',
	[ErrorCode.UnknownSession]: 'Unknown session',
	[ErrorCode.SessionsLimitReached]:
		'Sessions limit for this account has been reached',
	[ErrorCode.ExpiredSession]: 'Your session expired',
};
