import Dashboard from '@/components/Dashboard'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { PrismaClient } from '@prisma/client'
import {redirect} from 'next/navigation'
const Page = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if(!user || !user.id) redirect('/auth-callback?origin=dashboard')

  const prisma = new PrismaClient()

  let dbUser = await  prisma.user.findFirst({ where
    :{ kindeId: user.id }})

    if(!dbUser) redirect('/auth-callback?origin=dashboard')

    return <Dashboard/>
}


export default Page