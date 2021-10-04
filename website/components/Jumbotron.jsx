import Image from 'next/image';
import logo from '../public/sapling-logo.png';
import vscodeLogo from '../public/vscode-logo.png'

const Jumbotron = () => {
    return (
        <div className="jumbotron mx-auto pt-5">
            <h1 className="display-4 logo d-flex justify-content-center d-flex align-items-center">
              <Image src={logo} />
              <b>Sapling</b>
            </h1>
            <p className="lead text-center">A convenient way to traverse your React app.</p>
            <hr className="my-4"/>
            <p>React is a powerful tool for building your frontend applications, but at scale navigating the hierarchy of your components can become frustrating. Sapling's intuitive interface reflects the hierarchical nature of your app, so you'll never have to think twice about navigation again.</p>
            <p className="lead d-flex justify-content-center">
                <a className="btn btn-sapling btn-lg d-flex align-items-center" href="#" role="button">
                  <span>Get Sapling for </span><Image src={vscodeLogo} /><span> VS Code </span>
                </a>
            </p>
        </div>
    )
}

export default Jumbotron;