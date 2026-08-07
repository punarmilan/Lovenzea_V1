export const Colors = {
  primary: '#E84D67', // Rose Gold
  primaryDark: '#FF7654',
  primaryLight: '#F5E6E8',
  secondary: '#F3A738', // Champagne Gold
  accent: '#F3D9DC', // Soft Blush
  background: '#FFF6F5', // Warm Ivory
  surface: '#FFFFFF',
  cardBackground: '#FFF6F5',
  text: '#2D1E23',
  textSecondary: '#88797D',
  border: '#FFF6F5',
  divider: '#F2E5E2',
  error: '#D32F2F',
  success: '#4CAF50',
  warning: '#E6A23C',
  overlay: 'rgba(0, 0, 0, 0.5)',
  white: '#FFFFFF',
  black: '#000000',
  buttonGradient: ['#F7E7E4', '#D8A7B1', '#E84D67'],
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  bodySmall: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
};

export const Shadows = {
  light: {
    shadowColor: '#E84D67',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#E84D67',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
