import { redirect } from 'next/navigation'

export default function Homepage() {
  redirect('/create')
  //
  // return (
  //   <DefaultLayout>
  //     <Landing />
  //   </DefaultLayout>
  // )
}
