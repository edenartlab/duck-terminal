type Props = {
  title?: string
}
const CardHeader = ({ title }: Props) => {
  return (
    <div className="relative bg-muted text-muted-foreground group-hover:text-primary h-6 md:h-9 p-1 z-10">
      <div className="flex justify-between items-center">{title}</div>
    </div>
  )
}

export default CardHeader
