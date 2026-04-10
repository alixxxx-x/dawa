import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return (
    <div className={cn('rounded-2xl bg-background shadow-sm border border-border', className)} {...props} />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('px-5 pt-5 pb-0', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-base font-semibold text-foreground', className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-muted-foreground mt-0.5', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('px-5 py-4', className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('px-5 pb-5 pt-0 flex items-center', className)} {...props} />
}
