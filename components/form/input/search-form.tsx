import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

const SearchForm = () => {
  return (
    <form className="flex-1 sm:flex-initial">
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          placeholder="Search..."
          type="search"
        />
      </div>
    </form>
  )
}

export default SearchForm
