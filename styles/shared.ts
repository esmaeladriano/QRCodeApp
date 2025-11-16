import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#4F46E5',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  bg: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#D1D5DB',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  success: '#10B981',
  divider: '#E5E7EB',
};

export const styles = StyleSheet.create({
  // Layouts
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  headerIconWrapperTop: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  // Headers
  headerIconWrapper: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 10,
  },

  // Banners
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  errorBannerText: {
    color: colors.error,
    fontSize: 13,
    flex: 1,
  },

  // Form fields
  field: {
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  successBorder: {
    borderColor: colors.success,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.textPrimary,
  },
  trailingIcon: {
    position: 'absolute',
    right: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
  },

  // Buttons
  link: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
    marginTop: 8,
  },
  primaryButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // Dividers
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textSecondary,
    fontSize: 12,
  },

  // Social buttons
  socialButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  socialButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },

  // Notices & Footer
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  noticeText: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Register-only extras
  successText: {
    color: colors.success,
    fontSize: 12,
    marginTop: 6,
  },
  strengthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  strengthBarBg: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.divider,
  },
  strengthChunk: {
    flex: 1,
  },
});
