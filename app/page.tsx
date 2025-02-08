import { redirect } from 'next/navigation'

export default function Homepage() {
  redirect('/duck')
  //
  // return (
  //   <DefaultLayout>
  //     <Landing />
  //   </DefaultLayout>
  // )
}
