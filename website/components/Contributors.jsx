import Image from 'next/image';
import githubIcon from '../public/github-icon.svg';

const Contributors = () => {
  return (
    <div className="contributors mx-auto">
      <hr className="my-4"/>
      <h2 className="text-center">Created By</h2>

      <div className="row">

        <div className="person col-sm-3">
          <div className="card">
            <Image src="https://avatars.githubusercontent.com/u/87096293" className="card-img-top" alt="Charles Gutwirth Picture" width={200} height={200}/>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Charles Gutwirth</h5>
              <div className="profile-links">
                <a href="https://github.com/charlesgutwirth" target="_blank" rel="noreferrer">
                  <Image className="profile-link" src={githubIcon} width={40} height={40} alt="Github OctoCat Logo"/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-sm-3">
          <div className="card">
            <Image src="https://avatars.githubusercontent.com/u/64238519" className="card-img-top" alt="Jordan Hisel Picture" width={200} height={200}/>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Jordan Hisel</h5>
              <div className="profile-links">
                <a href="https://github.com/jo-cella" target="_blank" rel="noreferrer">
                  <Image className="profile-link" src={githubIcon} width={40} height={40}  alt="Github OctoCat Logo"/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-sm-3">
          <div className="card">
            <Image src="https://avatars.githubusercontent.com/u/81602150" className="card-img-top" alt="Lindsay Baird Picture" width={200} height={200}/>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Lindsay Baird</h5>
              <div className="profile-links">
                <a href="https://github.com/labaird" target="_blank" rel="noreferrer">
                  <Image className="profile-link" src={githubIcon} width={40} height={40}  alt="Github OctoCat Logo"/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-sm-3">
          <div className="card">
            <Image src="https://avatars.githubusercontent.com/u/58193305" className="card-img-top" alt="Paul Coster Picture" width={200} height={200}/>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Paul Coster</h5>
              <div className="profile-links">
                <a href="https://github.com/PLCoster" target="_blank" rel="noreferrer">
                  <Image className="profile-link" src={githubIcon} width={40} height={40}  alt="Github OctoCat Logo"/>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contributors;