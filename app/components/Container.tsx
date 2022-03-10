import clsx from 'clsx'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Container = ({ children, className, ...props }: ContainerProps) => {
  return (
    <div className={clsx('max-w-7xl mx-auto px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export default Container
