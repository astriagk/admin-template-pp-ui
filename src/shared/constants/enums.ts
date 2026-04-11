const AuthTags = {
  AUTH: 'Auth',
  ADMIN: 'Admin',
  DRIVER: 'Driver',
  PARENT: 'Parent',
  SCHOOL: 'School',
  PAYMENT: 'Payment',
  STUDENT: 'Student',
  TRIP: 'Trip',
  ASSIGNMENT: 'Assignment',
  SUBSCRIPTION: 'Subscription',
  ROLE: 'Role',
  AUDIT_LOG: 'AuditLog',
  NOTIFICATION: 'Notification',
  RATING: 'Rating',
} as const

const ApiMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const

enum UserRoles {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  SCHOOL_ADMIN = 'school_admin',
  DRIVER = 'driver',
  PARENT = 'parent',
}

const UserRolesType = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
  school_admin: 'School Admin',
  driver: 'Driver',
  parent: 'Parent',
}

enum AssignmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  PARENT_REQUESTED = 'parent_requested',
  REJECTED = 'rejected',
}

enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

const ApprovalStatusType = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

enum ModelModes {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view',
  CREATE = 'create',
}

enum TripStatus {
  SCHEDULED = 'scheduled',
  STARTED = 'started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

enum PlanType {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

enum PricingModel {
  FLAT = 'flat',
  PER_KID = 'per_kid',
  BASE_PLUS_PER_KID = 'base_plus_per_kid',
}

const PlanTypeLabel: Record<PlanType, string> = {
  [PlanType.MONTHLY]: 'Monthly',
  [PlanType.QUARTERLY]: 'Quarterly',
  [PlanType.YEARLY]: 'Yearly',
}

const PricingModelLabel: Record<PricingModel, string> = {
  [PricingModel.FLAT]: 'Flat',
  [PricingModel.PER_KID]: 'Per Kid',
  [PricingModel.BASE_PLUS_PER_KID]: 'Base + Per Kid',
}

const PlanTypeBadge: Record<PlanType, string> = {
  [PlanType.MONTHLY]: 'badge-blue',
  [PlanType.QUARTERLY]: 'badge-purple',
  [PlanType.YEARLY]: 'badge-green',
}

enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

const PaymentMethodLabel: Record<string, string> = {
  netbanking: 'Net Banking',
  upi: 'UPI',
  card: 'Card',
  wallet: 'Wallet',
}

enum PaymentType {
  SUBSCRIPTION = 'subscription',
  RENEWAL = 'renewal',
  REFUND = 'refund',
  ONE_TIME = 'one_time',
}

const PaymentTypeLabel: Record<PaymentType, string> = {
  [PaymentType.SUBSCRIPTION]: 'Subscription',
  [PaymentType.RENEWAL]: 'Renewal',
  [PaymentType.REFUND]: 'Refund',
  [PaymentType.ONE_TIME]: 'One Time',
}

// Obfuscated storage keys — what actually appears in browser localStorage
const STORAGE_KEYS = {
  ACCESS_TOKEN:  '_pp_a',  // access_token
  REFRESH_TOKEN: '_pp_r',  // refresh_token
  ADMIN:         '_pp_u',  // admin
}

// Developer reference: obfuscated key → human-readable name
const STORAGE_KEY_MAP: Record<string, string> = {
  '_pp_a':    'access_token',
  '_pp_r':    'refresh_token',
  '_pp_u':    'admin',
  '_pp_sc':   'data-sidebar-colors',
  '_pp_ss':   'data-sidebar-size',
  '_pp_tn':   'data-theme-nav-type',
  '_pp_lt':   'data-layout-type',
  '_pp_lw':   'data-layout-content-width',
  '_pp_lm':   'data-layout-mode',
  '_pp_sb':   'data-sidebar',
  '_pp_lang': 'I18N_LANGUAGE',
}

// Maps HTML attribute names → obfuscated localStorage keys (used in layout/theme utils)
const THEME_STORAGE_MAP: Record<string, string> = {
  'data-sidebar-colors':       '_pp_sc',
  'data-sidebar-size':         '_pp_ss',
  'data-theme-nav-type':       '_pp_tn',
  'data-layout-type':          '_pp_lt',
  'data-layout-content-width': '_pp_lw',
  'data-layout-mode':          '_pp_lm',
  'data-sidebar':              '_pp_sb',
  'I18N_LANGUAGE':             '_pp_lang',
}

export {
  AuthTags,
  ApiMethods,
  UserRoles,
  UserRolesType,
  AssignmentStatus,
  ApprovalStatus,
  ApprovalStatusType,
  ModelModes,
  TripStatus,
  PlanType,
  PricingModel,
  PlanTypeLabel,
  PricingModelLabel,
  PlanTypeBadge,
  PaymentStatus,
  PaymentMethodLabel,
  PaymentType,
  PaymentTypeLabel,
  STORAGE_KEYS,
  STORAGE_KEY_MAP,
  THEME_STORAGE_MAP,
}
