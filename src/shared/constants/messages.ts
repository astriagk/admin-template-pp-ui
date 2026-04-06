// Authentication Messages

export const MESSAGES = {
  AUTH: {
    VALIDATION: {
      EMAIL_PASSWORD_REQUIRED: 'Email and password are required.',
    },
    SUCCESS: {
      LOGIN_SUCCESS: 'Login successful!',
    },
    ERROR: {
      LOGIN_FAILED:
        'Login failed. Please check your credentials and try again.',
    },
  },
  ADMIN: {
    VALIDATION: {
      ADMIN_ID_REQUIRED: 'Admin ID is required.',
      INVALID_ROLE: 'Invalid admin role selected.',
      INVALID_PAGE_NUMBER: 'Invalid page number.',
    },
    SUCCESS: {
      FETCH_LIST_SUCCESS: 'Admin list fetched successfully.',
      ADMIN_CREATED: 'Admin created successfully.',
      ADMIN_UPDATED: 'Admin updated successfully.',
      ADMIN_DELETED: 'Admin deleted successfully.',
    },
    ERROR: {
      FETCH_LIST_FAILED: 'Failed to fetch admin list. Please try again.',
      CREATE_FAILED: 'Failed to create admin. Please try again.',
      UPDATE_FAILED: 'Failed to update admin. Please try again.',
      DELETE_FAILED: 'Failed to delete admin. Please try again.',
      ADMIN_NOT_FOUND: 'Admin not found.',
    },
    LOADING: {
      FETCHING_LIST: 'Fetching admin list...',
      CREATING_ADMIN: 'Creating admin...',
      UPDATING_ADMIN: 'Updating admin...',
      DELETING_ADMIN: 'Deleting admin...',
    },
  },
  SUBSCRIPTION: {
    SUCCESS: {
      PLAN_CREATED: 'Plan created successfully.',
      PLAN_UPDATED: 'Plan updated successfully.',
      PLAN_ACTIVATED: 'Plan activated successfully.',
      PLAN_DEACTIVATED: 'Plan deactivated successfully.',
    },
    ERROR: {
      CREATE_FAILED: 'Failed to create plan. Please try again.',
      UPDATE_FAILED: 'Failed to update plan. Please try again.',
      ACTIVATE_FAILED: 'Failed to activate plan. Please try again.',
      DEACTIVATE_FAILED: 'Failed to deactivate plan. Please try again.',
    },
    LOADING: {
      CREATING_PLAN: 'Creating plan...',
      UPDATING_PLAN: 'Updating plan...',
    },
  },
  PAYMENT: {
    SUCCESS: {
      REFUND_PROCESSED: 'Refund processed successfully.',
    },
    ERROR: {
      FETCH_FAILED: 'Failed to fetch payments. Please try again.',
      REFUND_FAILED: 'Failed to process refund. Please try again.',
    },
    LOADING: {
      FETCHING_PAYMENTS: 'Fetching payments...',
      PROCESSING_REFUND: 'Processing refund...',
    },
  },
  COMMON: {
    ERROR: {
      NO_AUTH_TOKEN: 'No authentication token found. Please log in.',
      TOKEN_VERIFICATION_FAILED:
        'Token verification failed. Please log in again.',
    },
    LOADING: {
      VERIFYING_AUTH: 'Verifying authentication...',
    },
  },
}
