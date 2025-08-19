import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

function Footer() {
  return (
    <footer className="py-4 flex justify-center font-primary items-center">
      Built with <FontAwesomeIcon icon={faHeart} className="w-5 text-red-600 mx-1" /> by{' '}
      <a
        href="https://www.linkedin.com/in/abid-hasan-masum/"
        target="_blank"
        rel="noreferrer"
        className="text-palette-dark font-bold px-1"
      >
        Abid Hasan
        </a>
    </footer>
  )
}

export default Footer
