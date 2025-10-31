/**
 * Table de tarification pour les packages de Koins
 *
 * Cette configuration est partagée entre le client et le serveur.
 * Elle définit les différents packages disponibles à l'achat.
 */

export interface PricingPackage {
  productId: string
  price: number
}

export const pricingTable: Record<number, PricingPackage> = {
  10: {
    productId: 'prod_TJrIuugdxUfIh6',
    price: 0.5
  },
  50: {
    productId: 'prod_TJrJlPk1OkhK9E',
    price: 1
  },
  500: {
    productId: 'prod_TJrJqc1MXPSb8t',
    price: 2
  },
  1000: {
    productId: 'prod_TJrKDD5VieU8H9',
    price: 3
  },
  5000: {
    productId: 'prod_TJrLeyDGzXlfRb',
    price: 10
  }
}
