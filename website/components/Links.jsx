import Image from 'next/image';
import githubIcon from '../public/github-icon.svg';
import mediumIcon from '../public/medium-logo.svg';

const Links = () => {
  return (
    <div className="links-section mx-auto">
      <hr className="my-4"/>
      <h2 className="text-center">Links</h2>
      <div className="links">
        <div className="link mx-auto">
          <p className="text-center">View the product</p>
          <a href="https://github.com/oslabs-beta/sapling" target="_blank" rel="noreferrer">
            <Image src={githubIcon} alt="Github OctoCat Logo"/>
          </a>
        </div>
        <div className="link mx-auto">
          <p className="text-center">Read more about Sapling</p>
          <a href="https://medium.com/@saplingextension/introducing-sapling-a-vs-code-extension-for-traversing-your-react-component-hierarchy-3ac94d95887e" target="_blank" rel="noreferrer">
            <Image src={mediumIcon} alt="Medium M Logo"/>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Links;