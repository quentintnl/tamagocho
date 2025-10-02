import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className='bg-lochinvar-950 text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-xl font-bold mb-4'>Tamagocho</h3>
            <p className='text-gray-400'>Votre compagnon virtuel adorable et attachant.</p>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Légal</h4>
            <ul className='space-y-2 text-gray-400'>
              <li><a href='#' className='hover:text-white'>Mentions légales</a></li>
              <li><a href='#' className='hover:text-white'>Politique de confidentialité</a></li>
              <li><a href='#' className='hover:text-white'>CGU</a></li>
              <li><a href='#' className='hover:text-white'>Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Support</h4>
            <ul className='space-y-2 text-gray-400'>
              <li><a href='#' className='hover:text-white'>Centre d'aide</a></li>
              <li><a href='#' className='hover:text-white'>FAQ</a></li>
              <li><a href='#' className='hover:text-white'>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className='text-lg font-semibold mb-4'>Réseaux sociaux</h4>
            <ul className='space-y-2 text-gray-400'>
              <li><a href='#' className='hover:text-white'>Twitter</a></li>
              <li><a href='#' className='hover:text-white'>Instagram</a></li>
              <li><a href='#' className='hover:text-white'>Discord</a></li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>&copy; {new Date().getFullYear()} Tamagocho. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
