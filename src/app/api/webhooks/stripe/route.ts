/**
 * Stripe Webhook Handler
 *
 * Infrastructure Layer: Gère les événements webhooks de Stripe
 *
 * Responsibilities:
 * - Valider la signature du webhook
 * - Traiter les événements checkout.session.completed
 * - Ajouter les Koins au wallet de l'utilisateur
 * - Gérer les erreurs de manière sécurisée
 *
 * Single Responsibility: Point d'entrée pour les webhooks Stripe
 */

import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { addCoins } from '@/services/wallet.service'
import { pricingTable } from '@/config/pricing'
import type Stripe from 'stripe'

/**
 * POST handler pour les webhooks Stripe
 *
 * @param request - La requête HTTP contenant l'événement Stripe
 * @returns Response avec status approprié
 */
export async function POST (request: Request): Promise<Response> {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (signature === null || signature === undefined) {
    console.error('❌ Stripe signature manquante')
    return new Response('Signature manquante', { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Vérification de la signature du webhook
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (webhookSecret === undefined || webhookSecret === null || webhookSecret === '') {
      console.error('❌ STRIPE_WEBHOOK_SECRET non défini')
      return new Response('Configuration serveur invalide', { status: 500 })
    }

    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('❌ Erreur de validation du webhook:', err)
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      { status: 400 }
    )
  }

  // Traitement de l'événement
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Récupération des informations du paiement
        const userId = session.metadata?.userId
        const amount = session.amount_total

        if (userId === undefined || userId === null || userId === '') {
          console.error('❌ userId manquant dans les metadata')
          return new Response('Métadonnées invalides', { status: 400 })
        }

        if (amount === undefined || amount === null) {
          console.error('❌ Montant manquant')
          return new Response('Montant invalide', { status: 400 })
        }

        // Conversion du montant en cents vers euros pour retrouver le package
        const amountInEuros = amount / 100

        // Recherche du package correspondant
        let koinsToAdd = 0
        for (const [koins, pkg] of Object.entries(pricingTable)) {
          if (pkg.price === amountInEuros) {
            koinsToAdd = parseInt(koins, 10)
            break
          }
        }

        if (koinsToAdd === 0) {
          console.error('❌ Package non trouvé pour le montant:', amountInEuros)
          return new Response('Package non trouvé', { status: 400 })
        }

        // Ajout des Koins au wallet
        console.log(`✅ Ajout de ${koinsToAdd} Koins au wallet de l'utilisateur ${userId}`)
        await addCoins({
          ownerId: userId,
          amount: koinsToAdd
        })

        console.log(`✅ Paiement réussi: ${koinsToAdd} Koins ajoutés pour l'utilisateur ${userId}`)
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        // Gérer les paiements asynchrones (si nécessaire)
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✅ Paiement asynchrone réussi:', session.id)
        break
      }

      case 'checkout.session.async_payment_failed': {
        // Gérer les échecs de paiement asynchrone
        const session = event.data.object as Stripe.Checkout.Session
        console.error('❌ Échec du paiement asynchrone:', session.id)
        break
      }

      default:
        console.log(`ℹ️ Événement non géré: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('❌ Erreur lors du traitement du webhook:', err)
    return new Response(
      `Webhook Handler Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      { status: 500 }
    )
  }
}

