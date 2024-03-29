import { chromium } from '@playwright/test'
import path from 'node:path'
import prisma from '../../prisma'

export default async function globalConfig() {
  const storagePath = path.resolve(__dirname, 'storageState.json')
  const date = new Date()
  const sessionToken = '9468389e-ff19-4eb4-bf73-b56516e9b7e8'

  await prisma.user.upsert({
    where: {
      email: 'ebn646@gmail.com',
    },
    create: {
      name: 'userA',
      email: 'ebn646@gmail.com',
    },
    update: {},
  })
  const browser = await chromium.launch()
  const context = await browser.newContext()
  await context.addCookies([
    {
      name: 'next-auth.session-token',
      value: sessionToken,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      expires: Math.round((Date.now() + 86400000 * 1) / 1000),
    },
  ])
  await context.storageState({ path: storagePath })
  await browser.close()
}
