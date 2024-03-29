import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server';
import {publicProcedure, router} from './trpc'
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

export const appRouter = router({
    authCallback: publicProcedure.query(async ()=>{
        const {getUser} = getKindeServerSession()
        const user = await getUser()

        if(!user?.id || !user?.email) throw new TRPCError({code:'UNAUTHORIZED'})

        // check if the user is in the database

        let dbUser = await prisma.user.findFirst({
            where: {
                kindeId: 'user.id'
            }
        });
  
      if (!dbUser) {
        // create user in db
        await db.user.create({
          data: {
            kindeId: user.id,
            email: user.email,
          },
        })
      }
  
      return { success: true }
        
    }),
});

export type AppRouter = typeof appRouter;