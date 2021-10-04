import Image from 'next/image';
import githubIcon from '../public/github-icon.svg';

const Contributors = () => {
  return (
    <div className="contributors mx-auto">
      <hr className="my-4"/>
      <h2 className="text-center">Created By</h2>

      <div className="row">

        <div className="person col-xs-3 col-sm-3 col-md-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/87096293" className="card-img-top"/>
            <div className="card-body">
              <img className="profile-small" src="https://avatars.githubusercontent.com/u/87096293" />
              <div className="person-info text-center">
                <h5 className="card-title">Charles Gutwirth</h5>
                <a href="https://github.com/charlesgutwirth" target="_blank">
                  <Image src={githubIcon}/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-xs-3 col-sm-3 col-md-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/64238519" className="card-img-top"/>
            <div className="card-body">
              <img className="profile-small" src="https://avatars.githubusercontent.com/u/64238519" />
              <div className="person-info text-center">
                <h5 className="card-title">Jordan Hisel</h5>
                <a href="https://github.com/jo-cella" target="_blank">
                  <Image src={githubIcon}/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-xs-3 col-sm-3 col-md-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/81602150" className="card-img-top"/>
            <div className="card-body">
              <img className="profile-small" src="https://avatars.githubusercontent.com/u/81602150" />
              <div className="person-info text-center">
                <h5 className="card-title">Lindsay Baird</h5>
                <a href="https://github.com/labaird" target="_blank">
                  <Image src={githubIcon}/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-xs-3 col-sm-3 col-md-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/58193305" className="card-img-top"/>
            <div className="card-body">
              <img className="profile-small" src="https://avatars.githubusercontent.com/u/58193305" />
              <div className="person-info text-center">
                <h5 className="card-title">Paul Coster</h5>
                <a href="https://github.com/PLCoster" target="_blank">
                  <Image src={githubIcon}/>
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