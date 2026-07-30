export type LocalizationPreferences = {
  currency: string
  locale: string
  timeZone: string
}

export const DEFAULT_LOCALIZATION: LocalizationPreferences = {
  // Preserve the app's existing USD behaviour until a user changes it.
  currency: "USD",
  locale: "en-US",
  timeZone: "UTC",
}

export const CURRENCY_OPTIONS = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "BDT", label: "Bangladeshi Taka (BDT)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "INR", label: "Indian Rupee (INR)" },
  { value: "SGD", label: "Singapore Dollar (SGD)" },
  { value: "JPY", label: "Japanese Yen (JPY)" },
  { value: "CAD", label: "Canadian Dollar (CAD)" },
  { value: "AUD", label: "Australian Dollar (AUD)" },
] as const

export const LOCALE_OPTIONS = [
  { value: "en-US", label: "English (United States)" },
  { value: "en-BD", label: "English (Bangladesh)" },
  { value: "bn-BD", label: "বাংলা (বাংলাদেশ)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "en-SG", label: "English (Singapore)" },
  { value: "hi-IN", label: "हिन्दी (भारत)" },
] as const

export const TIME_ZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Dhaka", label: "Dhaka" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Kolkata", label: "Kolkata" },
  { value: "Europe/London", label: "London" },
  { value: "America/New_York", label: "New York" },
  { value: "Australia/Sydney", label: "Sydney" },
] as const

const supportedCurrencies = new Set<string>(
  CURRENCY_OPTIONS.map((option) => option.value),
)
const supportedLocales = new Set<string>(
  LOCALE_OPTIONS.map((option) => option.value),
)
const supportedTimeZones = new Set<string>(
  TIME_ZONE_OPTIONS.map((option) => option.value),
)

export function isSupportedCurrency(value: string): boolean {
  return supportedCurrencies.has(value)
}

export function isSupportedLocale(value: string): boolean {
  return supportedLocales.has(value)
}

export function isSupportedTimeZone(value: string): boolean {
  return supportedTimeZones.has(value)
}

type UserWithMetadata =
  | {
      user_metadata?: Record<string, unknown> | null
    }
  | null
  | undefined

/**
 * Currency/locale/time-zone preferences are stored in Supabase Auth
 * user_metadata. They are display preferences only and must never be used
 * for authorization.
 */
export function getLocalizationPreferences(
  user: UserWithMetadata,
): LocalizationPreferences {
  const metadata = user?.user_metadata ?? {}

  const currency =
    typeof metadata.defaultCurrency === "string" &&
    isSupportedCurrency(metadata.defaultCurrency)
      ? metadata.defaultCurrency
      : DEFAULT_LOCALIZATION.currency

  const locale =
    typeof metadata.locale === "string" &&
    isSupportedLocale(metadata.locale)
      ? metadata.locale
      : DEFAULT_LOCALIZATION.locale

  const timeZone =
    typeof metadata.timeZone === "string" &&
    isSupportedTimeZone(metadata.timeZone)
      ? metadata.timeZone
      : DEFAULT_LOCALIZATION.timeZone

  return { currency, locale, timeZone }
}

type MoneyValue = number | string | { toString(): string }

function toFiniteNumber(value: MoneyValue): number {
  const numericValue =
    typeof value === "number" ? value : Number(value.toString())

  return Number.isFinite(numericValue) ? numericValue : 0
}

export function formatCurrency(
  value: MoneyValue,
  preferences: Pick<LocalizationPreferences, "currency" | "locale">,
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(preferences.locale, {
    style: "currency",
    currency: preferences.currency,
    currencyDisplay: "narrowSymbol",
    ...options,
  }).format(toFiniteNumber(value))
}

export function getCurrencySymbol(
  preferences: Pick<LocalizationPreferences, "currency" | "locale">,
): string {
  const currencyPart = new Intl.NumberFormat(preferences.locale, {
    style: "currency",
    currency: preferences.currency,
    currencyDisplay: "narrowSymbol",
  })
    .formatToParts(0)
    .find((part) => part.type === "currency")

  return currencyPart?.value ?? preferences.currency
}

export function formatDate(
  value: Date | string | number,
  preferences: Pick<LocalizationPreferences, "locale" | "timeZone">,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return new Intl.DateTimeFormat(preferences.locale, {
    timeZone: preferences.timeZone,
    ...options,
  }).format(date)
}
