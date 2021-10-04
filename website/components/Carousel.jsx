const Carousel = () => {
  return (
    <div className="carousel mx-auto">
      <hr />
      <h2 className="text-center">Feature Demo</h2>
      <div id="carouselExampleIndicators" className="carousel slide mt-3 mb-5" data-bs-ride="carousel" data-bs-interval="false">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img className="d-block w-100" src='/gen_tree_demo.gif' alt="First slide"/>
            <div className="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Open a root component to structure your app's files so they match its dependency relationships.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src='/icons_demo.gif' alt="Second slide"/>
            <div className="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Use Sapling's intuitive icons to get a list of props available to each component, see which components are connected to your Redux store, and open the file you wish to edit.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src='/rebuild_on_save_demo.gif' alt="Third slide"/>
            <div className="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Sapling is highly responsive, and notices whenever you edit and save a file.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src='/build_tree_demo.gif' alt="Fourth slide"/>
            <div className="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Rebuild the tree with your currently open file as the root. Note that Sapling retains its expanded state between sessions.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src='/settings_theme_demo.gif' alt="Fifth slide"/>
            <div className="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Toggle the display of third-party and React Router components, and watch as Sapling's theme changes to match your preferences.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
    </div>
  </div>
  )
}

export default Carousel;