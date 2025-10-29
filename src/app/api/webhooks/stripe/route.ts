import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import Wallet from '@/db/models/wallet.model'
import { pricingTable } from '@/config/pricing'

export const runtime = 'nodejs'

export async function POST (req: Request): Promise<Response> {
    const sig = (await headers()).get('stripe-signature')
    const payload = await req.text() // corps brut requis
    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET as string)
    } catch (err: any) {
        return new Response(`Webhook Error: ${err.message as string}`, { status: 400 })
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            console.log('Checkout session completed')
            console.log(event.data.object)

            const wallet = await Wallet.findOne({ ownerId: event?.data?.object?.metadata?.userId })
            if (wallet !== null && wallet !== undefined) {
                const amountPaid = (event?.data?.object?.amount_total ?? 0) / 100
                const entry = Object.entries(pricingTable).find(([_, pkg]) => pkg.price === amountPaid)

                if (entry !== undefined) {
                    const koinsToAdd = Number(entry[0])
                    wallet.balance = Number(wallet.balance) + koinsToAdd
                    wallet.markModified('balance')
                    await wallet.save()
                }
            }
            break
        }
        case 'payment_intent.succeeded': {
            console.log('Payment intent succeeded')
            console.log(event.data.object)
            // TODO: idem pour flow Payment Element
            break
        }
        // gérez d'autres événements utiles (payment_failed, refund, dispute...)
    }
    return new Response('ok', { status: 200 })
}
