import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { pricingTable } from '@/config/pricing'
import { headers } from 'next/headers'

export async function POST (request: Request): Promise<Response> {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session === null || session === undefined) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { amount } = await request.json()

    const product = pricingTable[amount]

    if (product === undefined || product === null) {
        return new Response('Product not found', { status: 404 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product: product.productId,
                    unit_amount: product.price * 100
                },
                quantity: 1
            }
        ],
        customer_email: session.user.email,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL as string}/wallet`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL as string}/wallet`,
        metadata: {
            userId: session.user.id,
            productId: product.productId
        }
    })

    return new Response(JSON.stringify({ url: checkoutSession.url }), { status: 200 })
}
