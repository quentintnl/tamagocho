import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import Wallet from '@/db/models/wallet.model'

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
            console.log('✅ Checkout session completed')
            console.log('Event data:', event.data.object)

            const session = event.data.object
            const userId = session?.metadata?.userId
            const coinsAmount = session?.metadata?.coinsAmount

            if (userId === null || userId === undefined) {
                console.error('❌ userId manquant dans les metadata')
                break
            }

            if (coinsAmount === null || coinsAmount === undefined) {
                console.error('❌ coinsAmount manquant dans les metadata')
                break
            }

            const wallet = await Wallet.findOne({ ownerId: userId })

            if (wallet !== null && wallet !== undefined) {
                const koinsToAdd = Number(coinsAmount)
                const previousBalance = wallet.coin
                wallet.coin = Number(wallet.coin) + koinsToAdd
                wallet.markModified('coin')
                await wallet.save()
                console.log(`✅ ${koinsToAdd} coins ajoutés au wallet de l'utilisateur ${userId}`)
                console.log(`   Balance avant: ${previousBalance}, Balance après: ${wallet.coin}`)
            } else {
                console.error(`❌ Wallet non trouvé pour l'utilisateur ${userId}`)
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
