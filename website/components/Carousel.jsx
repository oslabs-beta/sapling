import Image from 'next/image';

// Image imports
import GenTree from '../public/gen_tree_demo.gif';
import Icons from '../public/icons_demo.gif';
import Saved from '../public/respond_to_save_demo.gif';
import BuildTree from '../public/build_tree_button_demo.gif';
import Settings from '../public/settings_theme_demo.gif';

const Carousel = () => {
  return (
    <div class="carousel w-75 mx-auto">
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4" aria-label="Slide 5"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img class="d-block w-100" src='/gen_tree_demo.gif' alt="First slide"/>
            <div class="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Open a root component to structure your app's files to match its dependency relationships.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src='/icons_demo.gif' alt="Second slide"/>
            <div class="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Use Sapling's intuitive icons to get a list of props available to each component, see which components are connected to your Redux store, and open the file you wish to edit.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src='/respond_to_save_demo.gif' alt="Third slide"/>
            <div class="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Sapling is highly responsive, and notices whenever you edit and save a file.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src='/build_tree_button_demo.gif' alt="Fourth slide"/>
            <div class="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Rebuild the tree with your currently open file as the root. Note that Sapling retains its expanded state between sessions.</p>
            </div>
          </div>
          <div class="carousel-item">
            <img class="d-block w-100" src='/settings_theme_demo.gif' alt="Fifth slide"/>
            <div class="carousel-caption w-75 mx-auto d-none d-md-block">
              <p>Toggle the display of third-party and React Router components, and watch as Sapling's theme changes to match your preferences.</p>
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" role="button" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" role="button" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
    </div>
  </div>
  )
}

export default Carousel;