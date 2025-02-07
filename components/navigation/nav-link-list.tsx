import NavLink, { NavLinkProps } from '@/components/navigation/nav-link'

type Props = {
  items: NavLinkProps[]
  segments: string[]
  inSheet?: boolean
}

const NavLinkList = ({ items, segments, inSheet }: Props) => {
  return (
    <>
      {items.map((item, index) => (
        <NavLink
          inSheet={inSheet}
          key={`${item.label}_${index}`}
          label={item.label}
          segments={item.segments}
          active={
            (segments && segments.length === 0 && item.segments.length === 0) ||
            (segments && segments.length && item.segments[0] !== undefined)
              ? item.segments.every((v, i) => v === segments[i])
              : false
          }
        />
      ))}
    </>
  )
}

export default NavLinkList
