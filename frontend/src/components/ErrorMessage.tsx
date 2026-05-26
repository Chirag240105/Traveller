type Props = {
  children: string
}

const ErrorMessage = ({ children }: Props) => (
  <div className="rounded-3xl border border-red-700/30 bg-red-900/20 p-4 text-sm text-red-100">
    {children}
  </div>
)

export default ErrorMessage
