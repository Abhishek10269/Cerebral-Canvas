import { Hono } from 'hono'
import { User } from '@prisma/client'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>()

app.post('/api/v1/user/signup',async (c)=>{
  const body =  await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try{
    await prisma.user.create({
      data: {
        email:body.email,
        password:body.password,
        name:body.name
      }
    })
    const jwt = await sign({
    }, c.env.JWT_SECRET);
    return c.text(jwt)
  }
  catch(e){
    console.log(e);
    c.status(411);
    return c.text('Invalid')
  }
})

app.get('/', (c) => {
  return c.text('Hello Abhishek Keep working hard!')
})

export default app

