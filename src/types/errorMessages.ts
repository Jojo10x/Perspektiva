export function getReadableErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please try again.';
      case 'auth/invalid-email':
        return 'The email address is not valid. Please check and try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please check or register.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please login or use a different email.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'The login popup was closed. Please try again.';
        case 'auth/admin-restricted-operation':
          return 'This operation is restricted to administrators. Please contact support.';
      default:
        return 'An error occurred. Please try again.';
    }
  }