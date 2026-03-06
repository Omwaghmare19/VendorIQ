declare const AuthPage: (props: {
  defaultMode?: 'login' | 'signup'
  onLogin?: (user: unknown) => void
}) => JSX.Element

export default AuthPage

